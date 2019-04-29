import cache from 'util/cache'
import { interpolate } from 'flubber'
import updater from 'util/updater'
import dispatch from 'util/dispatch'
import { lerpColor, objectAssignAll } from 'util/helpers'

// test manifest, tobe defined by scene files
import testmanifest from 'data/manifest'

const detail = 8

class Loader {
    constructor() {
        updater.register('loaderUpdate', this.update, this)
        this.svgCache = cache.SVGS = { loadedSVGs: {}, bakes: {}, statics: {} }
    }

    load(manifest) {
        // // TODO: add dynamic json loading
        this.manifestData = testmanifest[manifest]
        //.default({})
        this.bakes = {}
        this.loadedSVGs = {}
        this.statics = {}
        this.svgs = this.manifestData.objects
        this.manifestAnimData = this.manifestData.animations
        this.loadSVGs()
    }

    _cache() {
        this.svgCache.loadedSVGs = objectAssignAll(this.svgCache.loadedSVGs, this.loadedSVGs)
        this.svgCache.bakes = objectAssignAll(this.svgCache.bakes, this.bakes)
        this.svgCache.statics = objectAssignAll(this.svgCache.statics, this.statics)
        dispatch.send('loadingComplete')
    }

    update() {
        if (this.loadingSVGs) {
            this.svgIndex++
            if (this.svgIndex >= this.svgKeys.length) {
                console.log(`svg ${this.svgIndex} / ${this.svgKeys.length} DONE`)
                this.svgSetIndex++
                if (this.svgSetIndex >= this.svgSetKeys.length) {
                    this.loadingSVGs = false
                    console.log(`svg set ${this.svgSetIndex} / ${this.svgSetKeys.length} DONE`)
                    this.autoBake()
                } else {
                    this._manifestLoop()
                }
            } else {
                this._svgLoadLoop()
            }
        }
        if (this.baking) {
            this.frameIndex++
            if (this.frameIndex >= this.animData.length) {
                console.log(`frame ${this.frameIndex} / ${this.animData.length} DONE`)
                this.animIndex++
                if (this.animIndex >= this.animKeys.length) {
                    console.log(`anim ${this.animIndex} / ${this.animKeys.length} DONE`)
                    this.charIndex++
                    if (this.charIndex >= this.charKeys.length) {
                        console.log(`char ${this.charIndex} / ${this.charKeys.length} DONE`)
                        this.baking = false
                        this._cache()
                    } else {
                        this._forChar()
                    }
                } else {
                    this._forAnim()
                }
            } else {
                this._forFrame()
            }
        }
    }

    /***************
     * these loops are broken out to debounce and throttle their performance during loading scenes
     * allowing for animating and interactible loading screens without render blocking
     */
    loadSVGs() {
        this.loadingSVGs = true
        this.svgSetKeys = Object.keys(this.svgs)
        this.svgSetIndex = 0
        this.svgSetLimit = 1
        this._manifestLoop()
    }

    _manifestLoop() {
        console.log(`svgset loading ${this.svgSetIndex} / ${this.svgSetKeys.length}`)
        this.setKey = this.svgSetKeys[this.svgSetIndex]
        this.loadedSVGs[this.setKey] = {}
        this.svgKeys = Object.keys(this.svgs[this.setKey])
        this.svgIndex = 0
        this.svgLimit = 1
        this._svgLoadLoop()
    }

    _svgLoadLoop() {
        console.log(`svg loading ${this.svgIndex} / ${this.svgKeys.length}`)
        for (let svgIndex = this.svgIndex; svgIndex < this.svgIndex + this.svgLimit; svgIndex++) {
            let svgKey = this.svgKeys[svgIndex]
            let name = this.svgs[this.setKey][svgKey]
            if (this.svgCache.loadedSVGs[this.setKey] && this.svgCache.loadedSVGs[this.setKey][svgKey]) {
                this.svgIndex++
                console.log(`already cached svg ${this.svgIndex} / ${this.svgKeys.length}`)
                if (this.svgIndex >= this.svgKeys.length) {
                    this.svgSetIndex++
                    console.log(`already cached svgset ${this.svgSetIndex} / ${this.svgSetKeys.length}`)
                    if (this.svgSetIndex >= this.svgSetKeys.length) {
                        this.loadingSVGs = false
                        this.autoBake()
                        break
                    }
                    this._manifestLoop()
                    break
                }
                this._svgLoadLoop()
                break
            }
            let svg = this.loadedSVGs[this.setKey][svgKey] = require(`!!preact-svg-loader!svg/${name}.svg`)
                .default({})
            this.loadedSVGs[this.setKey][svgKey].id = this.setKey
            this.svgIndex = svgIndex
            svg.childrenById = {}
            //// // TODO:
            // adobe illustrator = .children[2].children[0].children
            // desired = .children
            for (let pathIndex = 0; pathIndex < svg.children[2].children[0].children.length; pathIndex++) {
                let path = svg.children[2].children[0].children[pathIndex]
                svg.childrenById[path.attributes.id] = path
            }
        }
    }

    autoBake() {
        this.baking = true
        this.charKeys = Object.keys(this.manifestAnimData)
        this.charIndex = 0
        this.charLimit = 1
        this._forChar()
    }

    _forChar() {
        console.log(`char loading ${this.charIndex} / ${this.charKeys.length}`)
        this.charName = this.charKeys[this.charIndex]
        this.charData = this.manifestAnimData[this.charName]
        this.statics[this.charName] = this.statics[this.charName] || {}
        this.animKeys = Object.keys(this.charData)
        this.animIndex = 0
        this.animLimit = 1
        this.bakes[this.charName] = {}
        this._forAnim()
    }

    _forAnim() {
        console.log(`anim loading ${this.animIndex} / ${this.animKeys.length}`)
        this.animName = this.animKeys[this.animIndex]
        this.animData = this.charData[this.animName]
        // this.frameKeys = Object.keys(this.animData)
        this.frameIndex = 0
        this.frameLimit = 1
        if (this.svgCache.bakes[this.charName] && this.svgCache.bakes[this.charName][this.animName]) {
            this.animIndex++
            console.log(`already cached anim ${this.animIndex} / ${this.animKeys.length}`)
            if (this.animIndex >= this.animKeys.length) {
                this.charIndex++
                console.log(`already cached char ${this.charIndex} / ${this.charKeys.length}`)
                if (this.charIndex >= this.charKeys.length) {
                    this.baking = false
                    this._cache()
                    return
                }
                this._forChar()
                return
            }
            this._forAnim()
            return
        }
        this.bakes[this.charName][this.animName] = []
        this._forFrame()
    }

    _forFrame() {
        console.log(`frame loading ${this.frameIndex} / ${this.animData.length}`)
        let { from, to, timeframe } = this.animData[this.frameIndex]
        this.fromName = from
        this.toName = to
        this.timeframe = timeframe
        // // TODO:
        // adobe illustrator = .children[2].children[0].children
        // desired = .children
        this.fromChildren = this.loadedSVGs[this.charName][this.fromName].children[2].children[0].children
        this.fromViewBox = {
            x: this.loadedSVGs[this.charName][this.fromName].attributes.viewBox.split(' ')[2] * 1,
            y: this.loadedSVGs[this.charName][this.fromName].attributes.viewBox.split(' ')[3] * 1
        }

        this.toChildren = this.loadedSVGs[this.charName][this.toName].children[2].children[0].children
        this.toViewBox = {
            x: this.loadedSVGs[this.charName][this.toName].attributes.viewBox.split(' ')[2] * 1,
            y: this.loadedSVGs[this.charName][this.toName].attributes.viewBox.split(' ')[3] * 1
        }
        this.statics[this.charName][this.fromName] = this.statics[this.charName][this.fromName] || {}
        this.statics[this.charName][this.toName] = this.statics[this.charName][this.toName] || {}
        this.pathsToBake = {}
        this._forPath()
    }

    _forPath() {
        fromNameLoop: for (let fromIndex = 0; fromIndex < this.fromChildren.length; fromIndex++) {
            let { id: fromPathName, d: fromPath, fill: fromFill } = this.fromChildren[fromIndex].attributes
            toNameLoop: for (let toIndex = 0; toIndex < this.toChildren.length; toIndex++) {
                let { id: toPathName, d: toPath, fill: toFill } = this.toChildren[toIndex].attributes
                if (fromPathName === toPathName) {
                    // matching paths
                    this.pathsToBake[fromPathName] = {
                        fromFill,
                        fromPath,
                        toFill,
                        toPath
                    }
                    if (!this.statics[this.charName][this.fromName].viewBox)
                        this.statics[this.charName][this.fromName][fromPathName] = {
                            fill: fromFill,
                            path: fromPath
                        }
                    if (!this.statics[this.charName][this.toName].viewBox)
                        this.statics[this.charName][this.toName][toPathName] = {
                            fill: toFill,
                            path: toPath
                        }
                    this.toChildren.splice(toIndex, 1)
                    continue fromNameLoop
                }
            }
            // additional From paths - fade out
            let reMreplace = /M(\d*\.?\d*,\d*\.?\d*)[a-zA-Z,.]/g
            let test = reMreplace.exec(fromPath)
            if (test === null) {
                reMreplace = /M(\d*\.?\d*\.?\d*)[a-zA-Z,.]/g
                test = reMreplace.exec(fromPath)
            }
            let mReplace = `M${test[1]}`
            let fillerPath = cache.FILLER_PATH.replace('M -0.1 -0.1', mReplace)
            this.pathsToBake[fromPathName] = {
                fromFill,
                fromPath,
                toPath: fillerPath,
                toFill: fromFill,
                additional: true
            }
            if (!this.statics[this.charName][this.fromName].viewBox)
                this.statics[this.charName][this.fromName][fromPathName] = {
                    fill: fromFill,
                    path: fromPath,
                    additional: true
                }
        }
        // remaining To paths - fade in
        for (let remainderIndex = 0; remainderIndex < this.toChildren.length; remainderIndex++) {
            let child = this.toChildren[remainderIndex]
            let reMreplace = /M(\d*\.?\d*,\d*\.?\d*)[a-zA-Z,.]/g
            let test = reMreplace.exec(child.attributes.d)
            if (test === null) {
                reMreplace = /M(\d*\.?\d*\.?\d*)[a-zA-Z,.]/g
                test = reMreplace.exec(child.attributes.d)
            }
            let mReplace = `M${test[1]}`
            let fillerPath = cache.FILLER_PATH.replace('M -0.1 -0.1', mReplace)
            this.pathsToBake[child.attributes.id] = {
                toFill: child.attributes.fill,
                toPath: child.attributes.d,
                fromFill: child.attributes.fill,
                fromPath: fillerPath,
                remainder: true
            }
            if (!this.statics[this.charName][this.toName].viewBox)
                this.statics[this.charName][this.toName][child.attributes.id] = {
                    fill: child.attributes.fill,
                    path: child.attributes.d,
                    remainder: true
                }
        }
        this._bakeLoop()
    }

    _bakeLoop() {
        let bakedFrames = []
        // for every path in the frame to frame
        for (let pathIndex in this.pathsToBake) {
            let { fromPath, toPath, fromFill, toFill, remainder, additional } = this.pathsToBake[pathIndex]
            let morph = interpolate(fromPath, toPath, { maxSegmentLength: detail })
            // for the prefered amount of shapeframes between the keyframes
            for (let timeframeIndex = 0; timeframeIndex < this.timeframe; timeframeIndex++) {
                bakedFrames[timeframeIndex] = bakedFrames[timeframeIndex] || {}
                let percentage = (1 / (this.timeframe - 1)) * timeframeIndex,
                    newPath, viewBox, fill
                // strange morph behavior at 0 and 1
                if (percentage === 0) {
                    newPath = fromPath
                    viewBox = `0 0 ${this.fromViewBox.x} ${this.fromViewBox.y}`
                    fill = fromFill
                    if (!this.statics[this.charName][this.fromName].viewBox)
                        this.statics[this.charName][this.fromName].viewBox = viewBox
                } else if (percentage === 1) {
                    newPath = toPath
                    viewBox = `0 0 ${this.toViewBox.x} ${this.toViewBox.y}`
                    fill = toFill
                    if (!this.statics[this.charName][this.toName].viewBox)
                        this.statics[this.charName][this.toName].viewBox = viewBox
                } else {
                    newPath = morph(percentage)
                    let x = this.fromViewBox.x + ((this.toViewBox.x - this.fromViewBox.x) * percentage)
                    let y = this.fromViewBox.y + ((this.toViewBox.y - this.fromViewBox.y) * percentage)
                    viewBox = `0 0 ${x} ${y}`
                    fill = lerpColor(fromFill, toFill, percentage)
                }
                bakedFrames[timeframeIndex][pathIndex] = {
                    path: newPath,
                    fill,
                    remainder,
                    additional
                }
                bakedFrames[timeframeIndex].viewBox = viewBox
            }
        }
        this.bakes[this.charName][this.animName].push(bakedFrames)

    }
}

export default new Loader