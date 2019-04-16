import cache from 'util/cache'
import { interpolate } from 'flubber'

// test manifest, tobe defined by scene files
import manifest from 'data/manifest'

// test svgs, tobe defined per manifest
let svgs = {
    // character
    'test': {
        // frames
        'box': 'test/box',
        'star': 'test/star'
    }
}

export default class Loader {
    constructor(init = false) {
        this.manifestData = manifest
        this.bakes = {}
        this.loadedSVGs = {}
        // loop through svgs
        for (let i in svgs) {
            this.loadedSVGs[i] = {}
            for (let j in svgs[i]) {
                // preact-svg-loader returns function which .default run returns vNode with all svg+xml as jsobj
                this.loadedSVGs[i][j] = require(`!!preact-svg-loader!svg/${svgs[i][j]}.svg`).default({})
            }
        }
        // automatically bake up animations (demo, loading scene, main menu, etc)
        if (init) this.autoBake()
        this._cache()
    }

    _cache() { // cache loaded and baked
        cache.SVGS = {
            rawsvgs: this.loadedSVGs,
            bakes: this.bakes
        }
    }

    autoBake() {
        // for every character in the manifest (scene definition)
        for (let characterName in this.manifestData) {
            let characterData = this.manifestData[characterName]
            this.bakes[characterName] = {}
            // for every animation the character has
            for (let animationName in characterData) {
                let animationData = characterData[animationName]
                this.bakes[characterName][animationName] = []
                // for every frame of the animation
                for (let frameIndex = 0; frameIndex < animationData.length; frameIndex++) {
                    let { from: fromName, to: toName, timeframe } = animationData[frameIndex],
                        fromChildren = this.loadedSVGs[characterName][fromName].children,
                        toChildren = this.loadedSVGs[characterName][toName].children,
                        pathsToBake = {}
                    // for every shapepath defined for the 'from' frame
                    fromNameLoop: for (let fromIndex = 0; fromIndex < fromChildren.length; fromIndex++) {
                        let { id: fromPathName, d: fromPath, fill: fromFill } = fromChildren[fromIndex].attributes
                        // for every shapepath defined for the 'to' frame
                        toNameLoop: for (let toIndex = 0; toIndex < toChildren.length; toIndex++) {
                            let { id: toPathName, d: toPath, fill: toFill } = toChildren[toIndex].attributes
                            if (fromPathName === toPathName) {
                                // matching paths
                                pathsToBake[fromPathName] = {
                                    fromFill,
                                    fromPath,
                                    toFill,
                                    toPath
                                }
                                toChildren.splice(toIndex, 1)
                                continue fromNameLoop
                            }
                        }
                        // addtional From paths - fade out
                        pathsToBake[fromPathName] = {
                            fromFill,
                            fromPath,
                            toPath: cache.FILLER_PATH,
                            toFill: cache.WHITE
                        }
                    }
                    // remaining To paths - fade in
                    for (let remainderIndex = 0; remainderIndex < toChildren.length; remainderIndex++) {
                        let child = toChildren[remainderIndex]
                        pathsToBake[child.attributes.id] = {
                            toFill: child.attributes.fill,
                            toPath: child.attributes.d,
                            fromFill: cache.WHITE,
                            fromPath: cache.FILLER_PATH
                        }
                    }
                    debugger
                    let bakedFrames = []
                    // for every path in the frame to frame
                    for (let pathIndex in pathsToBake) {
                        let { fromPath, toPath, fromFill, toFill } = pathsToBake[pathIndex]
                        let morph = interpolate(fromPath, toPath, { maxSegmentLength: 8 })
                        // for the prefered amount of shapeframes between the keyframes
                        for (let timeframeIndex = 0; timeframeIndex < timeframe; timeframeIndex++) {
                            bakedFrames[timeframeIndex] = {}
                            let percentage = (1 / timeframe) * timeframeIndex
                            let newPath = morph(percentage)
                            // strange morph behavior at 0 and 1
                            if (percentage === 0) {
                                newPath = fromPath
                            } else if (percentage === 1) {
                                newPath = toPath
                            }
                            bakedFrames[timeframeIndex][pathIndex] = {
                                path: newPath,
                                fill: ''
                            }
                        }
                    }
                    debugger
                    this.bakes[characterName][animationName].push(bakedFrames)
                }
            }
        }
    }
}
