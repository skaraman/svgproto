import ReelData from 'data/reel'
import { interpolate } from 'flubber'

let svgs = {
    'test': {
        'box': 'test/box',
        'star': 'test/star'
    }
}

export default class Loader {
    constructor(init = false) {
        this.reelData = ReelData
        this.bakes = {}
        this.loadedSVGs = {}
        for (let i in svgs) {
            this.loadedSVGs[i] = {}
            for (let j in svgs[i]) {
                this.loadedSVGs[i][j] = require(`!!preact-svg-loader!svg/${svgs[i][j]}.svg`).default({})
            }
        }
        if (init) this.autoBake()
    }

    cache() {
        return {
            svgs: this.loadedSVGs,
            bakes: this.bakes
        }
    }

    autoBake() {
        for (let characterName in this.reelData) {
            let characterData = this.reelData[characterName]
            this.bakes[characterName] = {}
            for (let animationName in characterData) {
                let animationData = characterData[animationName]
                this.bakes[characterName][animationName] = []
                for (let frameIndex = 0; frameIndex < animationData.length; frameIndex++) {
                    let { from: fromName, to: toName, timeframe } = animationData[frameIndex],
                        fromChildren = this.loadedSVGs[characterName][fromName].children,
                        toChildren = this.loadedSVGs[characterName][toName].children,
                        fromPaths = {},
                        toPaths = {},
                        additionalFromPaths = {},
                        remainderToPaths = {}
                    fromNameLoop: for (let fromIndex = 0; fromIndex < fromChildren.length; fromIndex++) {
                        let { id: fromPathName, d: fromPath, fill: fromFill } = fromChildren[fromIndex].attributes
                        toNameLoop: for (let toIndex = 0; toIndex < toChildren.length; toIndex++) {
                            let { id: toPathName, d: toPath, fill: toFill } = toChildren[toIndex].attributes
                            if (fromPathName === toPathName) {
                                fromPaths[fromPathName] = {
                                    fill: fromFill,
                                    path: fromPath
                                }
                                toPaths[toPathName] = {
                                    fill: toFill,
                                    path: toPath
                                }
                                toChildren.splice(toIndex, 1)
                                continue fromNameLoop
                            }
                        }
                        additionalFromPaths[fromPathName] = {
                            fill: fromFill,
                            path: fromPath
                        }
                    }
                    for (let remainderIndex = 0; remainderIndex < toChildren.length; remainderIndex++) {
                        let child = toChildren[remainderIndex]
                        remainderToPaths[child.attributes.id] = {
                            fill: child.attributes.fill,
                            path: child.attributes.d
                        }
                    }
                    debugger
                    for (let timeframeIndex = 0; timeframeIndex < timeframe; timeframeIndex++) {

                    }
                }
            }
        }
    }

    bake(from, to, percentage) {

    }
}
