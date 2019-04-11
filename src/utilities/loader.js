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
                let svg = require(`!!preact-svg-loader!svg/${svgs[i][j]}.svg`)
                this.loadedSVGs[i][j] = svg.default({})
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
                    let fromName = animationData[frameIndex].from
                    let toName = animationData[frameIndex].to
                    let timeframe = animationData[frameIndex].timeframe
                    let fromChildren = this.loadedSVGs[characterName][fromName].children
                    let toChildren = this.loadedSVGs[characterName][toName].children
                    let fromPaths
                    let toPaths
                    let additionalFromPaths
                    let remainderToPaths
                    debugger
                    fromNameLoop: for (let i = 0; i < fromChildren; i++) {
                        let fromPathName = fromChildren[i].attributes.id
                        let fromPath = fromChildren[i].attributes.d
                        let fromFill = fromChildren[i].attributes.fill
                        toNameLoop: for (let j = 0; j < toChildren; j++) {
                            let toPathName = toChildren[i].attributes.id
                            let toPath = toChildren[i].attributes.d
                            let toFill = toChildren[i].attributes.fill
                            if (fromPathName === toPathName) {
                                fromPaths[fromPathName] = fromPath
                                toPaths[toPathName] = toPath
                            }
                        }
                    }
                    for (let bakeFrameIndex = 0; bakeFrameIndex < timeframe; bakeFrameIndex++) {
                        let percentage = (1 / timeframe) * bakeFrameIndex
                        let bakedFrame = fromFrame[tdx]

                    }
                    //bake timeframe frames to toFrame
                }
            }
        }
    }

    bake(from, to, percentage) {

    }
}