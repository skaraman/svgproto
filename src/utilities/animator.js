import cache from 'util/cache'
import updater from 'util/updater'

class Animator {
    constructor() {
        updater.register('animatorUpater', this.update, this)
        this.animations = []
        this.realTime = true
        this.rtMultiplier = 1
        this.remaindersRendered = {}
        this.additionalsRemoved = {}
    }

    update(dt) {
        if (this.realTime) {
            if (dt > 16) {
                this.rtMultiplier = ~~(dt / 16)
            }
        }
        for (let i = 0; i < this.animations.length; i++) {
            let ani = this.animations[i]
            this.remaindersRendered[ani.name] = this.remaindersRendered[ani.name] || {}
            for (let pathKey in ani.bakes[ani.frameIndex][ani.loopIndex]) {
                if (pathKey === 'viewBox') continue
                let path = ani.bakes[ani.frameIndex][ani.loopIndex][pathKey],
                    // TODO: adobe illustrator = .children[2].children[0].children
                    // desired = .children
                    children = ani.svg.children[2].children[0].children,
                    childrenById = ani.svg.childrenById,
                    child
                if (path.remainder && !this.remaindersRendered[ani.name][pathKey]) {
                    children.push(child = {
                        attributes: { id: pathKey },
                        children: [],
                        key: undefined,
                        nodeName: "path"
                    })
                    childrenById[pathKey] = child
                    this.remaindersRendered[ani.name][pathKey] = true
                    // if (this.additionalsRemoved[pathKey] === true) {
                    //     delete this.additionalsRemoved[pathKey]
                    // }
                }
                // else if (path.additional && !this.additionalsRemoved[pathKey]) {
                //     if (path.path.endsWith(' -0.1 0 z')) {
                //         children.splice(
                //             children.indexOf(childrenById[pathKey]),
                //             1
                //         )
                //         this.additionalsRemoved[pathKey] = true
                //         continue
                //     } else {
                //         child = childrenById[pathKey]
                //     }
                // }
                else {
                    child = childrenById[pathKey]
                }
                child.attributes.d = path.path
                child.attributes.fill = path.fill
            }
            ani.svg.attributes.viewBox = ani.bakes[ani.frameIndex][ani.loopIndex].viewBox
            ani.stateCallback(ani.svg)
            ani.loopIndex += this.rtMultiplier
            if (ani.loopIndex >= ani.bakes[ani.frameIndex].length) {
                ani.frameIndex++
                ani.loopIndex = 0
                if (ani.frameIndex >= ani.bakes.length) {
                    switch (ani.type) {
                    case 'loop':
                    case 'pingpong':
                        ani.frameIndex = 0
                        break
                    case 'repeat':
                        ani.frameIndex = 0
                        if (ani.repeatLimit) {
                            ani.repeatIndex++
                            if (ani.repeatIndex < ani.repeatLimit) {
                                break
                            }
                        }
                    case 'regular':
                    case 'reverse':
                        this.animations.splice(i, 1)
                        i--
                        break
                    }
                }
            }
        }
    }

    playAnimation(svg, stateCallback, name = 'default', type = 'regular') {
        let repeat = 0
        if (name === 'default') {
            // TEMP:
            if (svg.id === 'testObject') {
                name = 'testAnimation'
                type = 'pingpong'
            }
        }
        let bakes = cache.SVGS.bakes[svg.id][name]
        if (type === 'reverse') {
            bakes = bakes.reverse()
            for (let i = 0; i < bakes.length; i++) {
                bakes[i] = bakes[i].reverse()
            }
        } else if (type === 'pingpong') {
            let len = bakes.length;
            for (let i = len - 1; i >= 0; i--) {
                let revArr = bakes[i].copy().reverse()
                bakes.push(revArr)
            }
        } else if (type.startsWith('repeat')) {
            repeat = ~~type.replace('repeat', '')
            type = 'repeat'
        }
        this.animations.push({
            stateCallback,
            type,
            bakes,
            svg,
            name,
            frameIndex: 0,
            loopIndex: 0,
            repeatIndex: 0,
            repeatLimit: repeat
        })
    }

    setStaticFrame(svg, stateCallback, frame = 'default') {
        if (frame === 'default') {
            //// TEMP:
            if (svg.id === 'testObject') {
                frame = 'box'
            }
        }
        let staticSVG = cache.SVGS.statics[svg.id][frame]
        for (let id in svg.childrenById) {
            let child = svg.childrenById[id]
            if (!staticSVG[id]) {
                child.attributes.d = ''
                continue
            }
            child.attributes.d = staticSVG[child.attributes.id].path
            child.attributes.fill = staticSVG[child.attributes.id].fill
        }
        svg.attributes.viewBox = staticSVG.viewBox
        stateCallback(svg)
    }
}

export default new Animator