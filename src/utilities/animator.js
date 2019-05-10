import cache from 'util/cache'
import updater from 'util/updater'

class Animator {
  constructor() {
    updater.register('animatorUpater', this.update, this)
    this.animations = []
    this.animationsById = {}
    this.notRealTime = true
    this.rtMultiplier = 1
    this.remaindersRendered = {}
    this.additionalsRemoved = {}
  }

  update(dt) {
    if (this.notRealTime) {
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
          children.insert(path.index, child = {
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
        // hard hide 'removed' path
        if (path.path.endsWith(' -0.1 0 z')) {
          path.path = ''
        }
        child.attributes.d = path.path
        if (path.fill.id) {
          if (ani.svg.gradientById[path.fill.id]) {
            ani.svg.gradientById[path.fill.id].attributes.id = path.fill.id
            ani.svg.gradientById[path.fill.id].attributes.x1 = path.fill.x1
            ani.svg.gradientById[path.fill.id].attributes.x2 = path.fill.x2
            ani.svg.gradientById[path.fill.id].attributes.y1 = path.fill.y1
            ani.svg.gradientById[path.fill.id].attributes.y2 = path.fill.y2
            ani.svg.gradientById[path.fill.id].children[0].attributes['stop-color'] = path.fill.color1
            ani.svg.gradientById[path.fill.id].children[1].attributes['stop-color'] = path.fill.color2
            if (path.fill.gradientTransform)
              ani.svg.gradientById[path.fill.id].attributes.gradientTransform = path.fill.gradientTransform
          } else {
            let newGrad = {
              attributes: {
                gradientUnits: 'userSpaceOnUse',
                id: path.fill.id,
                x1: path.fill.x1,
                x2: path.fill.x2,
                y1: path.fill.y1,
                y2: path.fill.y2
              },
              children: [{
                  attributes: {
                    'stop-color': path.fill.color1,
                    'offset': 0
                  },
                  children: [],
                  key: undefined,
                  nodeName: "stop"
                },
                {
                  attributes: {
                    'stop-color': path.fill.color2,
                    'offset': 1
                  },
                  children: [],
                  key: undefined,
                  nodeName: "stop"
                }
              ],
              index: ani.svg.children[0].children.length,
              key: undefined,
              nodeName: "linearGradient"
            }
            if (path.fill.gradientTransform)
              newGrad.attributes.gradientTransform = path.fill.gradientTransform
            ani.svg.children[0].children.push(newGrad)
            ani.svg.gradientById[path.fill.id] = newGrad
          }
          child.attributes.fill = `url(#${path.fill.id})`
        } else {
          child.attributes.fill = path.fill
        }
      }
      if (ani.fitToWidth) {
        ani.svg.attributes.oldViewBox = ani.svg.attributes.viewBox
        ani.svg.attributes.viewBox = ani.bakes[ani.frameIndex][ani.loopIndex].viewBox
      }
      ani.stateCallback(ani.svg, ani.fitToWidth)
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

  play({ svg, stateCallback, name = 'default', type = 'regular', fitToWidth = true, from, to }) {
    let repeat = 0
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
    } else if (type === 'frame') {
      from = ~~from
      to = ~~to
      bakes = bakes.slice(from, to)
    }
    this.animationsById[name] = {
      stateCallback,
      type,
      fitToWidth,
      bakes,
      svg,
      name,
      frameIndex: 0,
      loopIndex: 0,
      repeatIndex: 0,
      repeatLimit: repeat
    }
    this.animations.push(this.animationsById[name])
  }

  kill(name) {
    this.animations.splice(
      this.animations.indexOf(this.animationsById[name]),
      1
    )
    delete this.animationsById[name]
  }

  setStaticFrame(svg, stateCallback, frame = 'default') {
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