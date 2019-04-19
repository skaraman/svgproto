import cache from 'util/cache'
import { interpolate } from 'flubber'
import updater from 'util/updater'
import dispatch from 'util/dispatch'

// test manifest, tobe defined by scene files
import testmanifest from 'data/manifest'

export default class Loader {
    constructor(manifest = testmanifest, init = false) {
        this.manifestData = manifest
        this.bakes = {}
        this.loadedSVGs = {}
        this.svgs = this.manifestData.objects
        this.manifestAnimationData = this.manifestData.animations
        updater.register('loaderUpdate', this.update, this)
        // automatically bake up animations (demo, loading scene, main menu, etc)
        if (init) {
            this.loadSVGs()
            this.autoBake()
            this._cache()
        }
    }

    _cache() { // cache loaded and baked
        cache.SVGS = {
            rawsvgs: this.loadedSVGs,
            bakes: this.bakes
        }
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
            if (this.frameIndex >= this.animationData.length) {
                console.log(`frame ${this.frameIndex} / ${this.animationData.length} DONE`)
                this.animationIndex++
                if (this.animationIndex >= this.animationKeys.length) {
                    console.log(`animation ${this.animationIndex} / ${this.animationKeys.length} DONE`)
                    this.characterIndex++
                    if (this.characterIndex >= this.characterKeys.length) {
                        console.log(`character ${this.characterIndex} / ${this.characterKeys.length} DONE`)
                        this.baking = false
                        this._cache()
                    } else {
                        this._forCharacter()
                    }
                } else {
                    this._forAnimation()
                }
            } else {
                this._forFrame()
            }
        }
    }

    /***************
     * these loops are broken out to debounce and throttle their performance during loading scenes
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
            let svgIndexKey = this.svgKeys[svgIndex]
            // preact-svg-loader returns function which .default run returns vNode with all svg+xml as jsobj
            this.loadedSVGs[this.setKey][svgIndexKey] = require(`!!preact-svg-loader!svg/${this.svgs[this.setKey][svgIndexKey]}.svg`)
                .default({})
            this.svgIndex = svgIndex;
        }
    }

    autoBake() {
        this.baking = true
        this.characterKeys = Object.keys(this.manifestAnimationData)
        this.characterIndex = 0
        this.characterLimit = 1
        this._forCharacter()
    }

    _forCharacter() {
        console.log(`character loading ${this.characterIndex} / ${this.characterKeys.length}`)
        this.characterName = this.characterKeys[this.characterIndex]
        this.characterData = this.manifestAnimationData[this.characterName]
        this.animationKeys = Object.keys(this.characterData)
        this.animationIndex = 0
        this.animationLimit = 1
        this.bakes[this.characterName] = {}
        this._forAnimation()
    }

    _forAnimation() {
        console.log(`animation loading ${this.animationIndex} / ${this.animationKeys.length}`)
        this.animationName = this.animationKeys[this.animationIndex]
        this.animationData = this.characterData[this.animationName]
        // this.frameKeys = Object.keys(this.animationData)
        this.frameIndex = 0
        this.frameLimit = 1
        this.bakes[this.characterName][this.animationName] = []
        this._forFrame()
    }

    _forFrame() {
        console.log(`frame loading ${this.frameIndex} / ${this.animationData.length}`)
        let { from, to, timeframe } = this.animationData[this.frameIndex]
        this.fromPathName = from
        this.toPathName = to
        this.timeframe = timeframe
        this.fromChildren = this.loadedSVGs[this.characterName][this.fromPathName].children
        this.toChildren = this.loadedSVGs[this.characterName][this.toPathName].children
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
                    this.toChildren.splice(toIndex, 1)
                    continue fromNameLoop
                }
            }
            // addtional From paths - fade out
            this.pathsToBake[fromPathName] = {
                fromFill,
                fromPath,
                toPath: cache.FILLER_PATH,
                toFill: cache.WHITE
            }
        }
        // remaining To paths - fade in
        for (let remainderIndex = 0; remainderIndex < this.toChildren.length; remainderIndex++) {
            let child = this.toChildren[remainderIndex]
            this.pathsToBake[child.attributes.id] = {
                toFill: child.attributes.fill,
                toPath: child.attributes.d,
                fromFill: cache.WHITE,
                fromPath: cache.FILLER_PATH
            }
        }
        this._bakeLoop()
    }

    _bakeLoop() {
        let bakedFrames = []
        // for every path in the frame to frame
        for (let pathIndex in this.pathsToBake) {
            let { fromPath, toPath, fromFill, toFill } = this.pathsToBake[pathIndex]
            let morph = interpolate(fromPath, toPath, { maxSegmentLength: 8 })
            // for the prefered amount of shapeframes between the keyframes
            for (let timeframeIndex = 0; timeframeIndex < this.timeframe; timeframeIndex++) {
                bakedFrames[timeframeIndex] = bakedFrames[timeframeIndex] || {}
                let percentage = (1 / this.timeframe) * timeframeIndex,
                    newPath
                // strange morph behavior at 0 and 1
                if (percentage === 0) {
                    newPath = fromPath
                } else if (percentage === 1) {
                    newPath = toPath
                } else {
                    newPath = morph(percentage)
                }
                bakedFrames[timeframeIndex][pathIndex] = {
                    path: newPath,
                    fill: ''
                }
            }
        }
        this.bakes[this.characterName][this.animationName].push(bakedFrames)
    }
}
