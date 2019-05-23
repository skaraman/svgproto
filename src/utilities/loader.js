import cache from 'util/cache'
import { interpolate } from 'flubber'
import updater from 'util/updater'
import dispatch from 'util/dispatch'
import { lerpColor, lerpGradient, objectAssignAll } from 'util/helpers'

// test manifest, tobe defined by scene files
import testmanifest from 'data/manifest'

const detail = 10

class Loader {
  constructor() {
    updater.register('loaderUpdate', this.update, this)
    cache.SVGS = { loadedSVGs: {}, bakes: {}, statics: {} }
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
    cache.SVGS.loadedSVGs = objectAssignAll(cache.SVGS.loadedSVGs, this.loadedSVGs)
    cache.SVGS.bakes = objectAssignAll(cache.SVGS.bakes, this.bakes)
    cache.SVGS.statics = objectAssignAll(cache.SVGS.statics, this.statics)
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
      if (this.bakeLooping) {
        this.pathIndex++
        this._bakeLoop()
        return
      } else if (this.forRemainderPathLooping) {
        this.remainderIndex++
        this._forRemainderPath()
        return

      } else if (this.forPathLooping) {
        this.fromIndex++
        this._forPath()
        return
      }
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
    this.svgLimit = 10
    this._svgLoadLoop()
  }

  _svgLoadLoop() {
    console.log(`svg loading ${this.svgIndex} / ${this.svgKeys.length}`)
    let limit = this.svgIndex + this.svgLimit
    for (let svgIndex = this.svgIndex; svgIndex < limit && svgIndex < this.svgKeys.length; svgIndex++) {
      let svgKey = this.svgKeys[svgIndex]
      let name = this.svgs[this.setKey][svgKey]
      if (cache.SVGS.loadedSVGs[this.setKey] && cache.SVGS.loadedSVGs[this.setKey][svgKey]) {
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
      let svg = this.loadedSVGs[this.setKey][svgKey] = require(`!!preact-svg-loader!svg/${name}.svg`).default({})
      // if (svg.children.length > 3) {
      //     svg = this._cleanSVGChildren(svg)
      // }
      this.loadedSVGs[this.setKey][svgKey].id = this.setKey
      this.svgIndex = svgIndex
      svg.childrenById = {}
      // TODO: adobe illustrator = .children[2].children[0].children
      // desired = .children
      for (let pathIndex = 0; pathIndex < svg.children[2].children[0].children.length; pathIndex++) {
        let path = svg.children[2].children[0].children[pathIndex]
        svg.childrenById[path.attributes.id] = path
        svg.childrenById[path.attributes.id].index = pathIndex
      }
      svg.gradientById = {}
      for (let gradIndex = 0; gradIndex < svg.children[0].children.length; gradIndex++) {
        let grad = svg.children[0].children[gradIndex]
        if (!grad.children[0] && grad.attributes['xlink:href']) {
          let refGradKey = grad.attributes['xlink:href'].replace('#', '')
          let gradRef = svg.gradientById[refGradKey]
          let child1 = { ...gradRef.children[0] }
          let child2 = { ...gradRef.children[1] }
          grad.children = [child1, child2]
          grad.attributes.gradientUnits = 'userSpaceOnUse'
          if (!grad.attributes.gradientTransform && gradRef.attributes.gradientTransform) grad.attributes.gradientTransform = gradRef.attributes.gradientTransform
          if (!grad.attributes.x1 && gradRef.attributes.x1) grad.attributes.x1 = gradRef.attributes.x1
          if (!grad.attributes.x2 && gradRef.attributes.x2) grad.attributes.x2 = gradRef.attributes.x2
          if (!grad.attributes.y1 && gradRef.attributes.y1) grad.attributes.y1 = gradRef.attributes.y1
          if (!grad.attributes.y2 && gradRef.attributes.y2) grad.attributes.y2 = gradRef.attributes.y2
          delete grad.attributes['xlink:href']
        }
        svg.gradientById[grad.attributes.id] = grad
        svg.gradientById[grad.attributes.id].index = gradIndex
      }
    }
  }

  _cleanSVGChildren(node) {
    debugger
    // strange bugs where children are applied recursively, need to assign new []
    for (let childIndex = node.children.length - 1; childIndex >= 0; childIndex--) {
      let child = node.children[childIndex]
      if (typeof child === 'string') node.children.splice(childIndex, 1)
      if (child.children) child.children = this._cleanSVGChildren(child)
    }
    return node
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
    this.frameIndex = 0
    this.frameLimit = 1
    if (cache.SVGS.bakes[this.charName] && cache.SVGS.bakes[this.charName][this.animName]) {
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
    // TODO: adobe illustrator = .children[2].children[0].children
    // desired = .children
    this.fromChildren = this.loadedSVGs[this.charName][this.fromName].children[2].children[0].children.copy()
    this.fromIndex = 0
    this.fromLimit = 2
    this.fromViewBox = {
      x: this.loadedSVGs[this.charName][this.fromName].attributes.viewBox.split(' ')[2] * 1,
      y: this.loadedSVGs[this.charName][this.fromName].attributes.viewBox.split(' ')[3] * 1
    }
    this.toChildren = this.loadedSVGs[this.charName][this.toName].children[2].children[0].children.copy()
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
    this.forPathLooping = true
    let limit = this.fromIndex + this.fromLimit - 1
    fromNameLoop: for (let fromIndex = this.fromIndex; fromIndex <= limit && fromIndex < this.fromChildren.length; fromIndex++) {
      let { id: fromPathName, d: fromPath, fill: fromFill } = this.fromChildren[fromIndex].attributes
      toNameLoop: for (let toIndex = 0; toIndex < this.toChildren.length; toIndex++) {
        let { id: toPathName, d: toPath, fill: toFill } = this.toChildren[toIndex].attributes
        if (fromPathName === toPathName) {
          // matching paths
          this.pathsToBake[fromPathName] = {
            fromFill,
            fromPath,
            toFill,
            toPath,
            index: this.loadedSVGs[this.charName][this.fromName].childrenById[fromPathName].index
          }
          if (!this.statics[this.charName][this.fromName].viewBox) {
            this.statics[this.charName][this.fromName][fromPathName] = {
              fill: fromFill,
              path: fromPath,
              index: this.loadedSVGs[this.charName][this.fromName].childrenById[fromPathName].index
            }
          }
          if (!this.statics[this.charName][this.toName].viewBox) {
            this.statics[this.charName][this.toName][toPathName] = {
              fill: toFill,
              path: toPath,
              index: this.loadedSVGs[this.charName][this.toName].childrenById[toPathName].index
            }
          }
          this.toChildren.splice(toIndex, 1)
          this.fromIndex = fromIndex
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
        additional: true,
        index: this.loadedSVGs[this.charName][this.fromName].childrenById[fromPathName].index
      }
      if (!this.statics[this.charName][this.fromName].viewBox) {
        this.statics[this.charName][this.fromName][fromPathName] = {
          fill: fromFill,
          path: fromPath,
          additional: true,
          index: this.loadedSVGs[this.charName][this.fromName].childrenById[fromPathName].index
        }
      }
      this.fromIndex = fromIndex
    }
    if (this.fromIndex >= this.fromChildren.length) {
      this.forPathLooping = false
      this.remainderIndex = 0
      this.remainderLimit = 10
      this._forRemainderPath()
    }
  }

  _forRemainderPath() {
    this.forRemainderPathLooping = true
    let limit = this.remainderIndex + this.remainderLimit - 1
    for (let remainderIndex = this.remainderIndex; remainderIndex <= limit && remainderIndex < this.toChildren.length; remainderIndex++) {
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
        remainder: true,
        index: this.loadedSVGs[this.charName][this.toName].childrenById[child.attributes.id].index

      }
      if (!this.statics[this.charName][this.toName].viewBox) {
        this.statics[this.charName][this.toName][child.attributes.id] = {
          fill: child.attributes.fill,
          path: child.attributes.d,
          remainder: true,
          index: this.loadedSVGs[this.charName][this.toName].childrenById[child.attributes.id].index
        }
      }
      this.remainderIndex = remainderIndex;
    }
    if (this.remainderIndex >= this.toChildren.length) {
      this.forRemainderPathLooping = false
      this.pathIndex = 0
      this.pathLimit = 10
      this.pathKeys = Object.keys(this.pathsToBake)
      this.bakedFrames = []
      this._bakeLoop()
    }
  }

  _bakeLoop() {
    this.bakeLooping = true
    let limit = this.pathIndex + this.pathLimit - 1
    for (let pathIndex = this.pathIndex; pathIndex <= limit && pathIndex < this.pathKeys.length; pathIndex++) {
      let pathName = this.pathKeys[pathIndex]
      let { fromPath, toPath, fromFill, toFill, remainder, additional, index } = this.pathsToBake[pathName]
      let morph = interpolate(fromPath, toPath, { maxSegmentLength: detail })
      // for the prefered amount of shapeframes between the keyframes
      for (let timeframeIndex = 0; timeframeIndex < this.timeframe; timeframeIndex++) {
        this.bakedFrames[timeframeIndex] = this.bakedFrames[timeframeIndex] || {}
        let percentage = (1 / (this.timeframe - 1)) * timeframeIndex,
          newPath, viewBox, fill, fromGrad = false,
          toGrad = false
        if (fromFill.startsWith('url(#')) {
          let fromGradKey = fromFill.replace('url(#', '').replace(')', '')
          fromGrad = this.loadedSVGs[this.charName][remainder ? this.toName : this.fromName].gradientById[fromGradKey]
        }
        if (toFill.startsWith('url(#')) {
          let toGradKey = toFill.replace('url(#', '').replace(')', '')
          toGrad = this.loadedSVGs[this.charName][additional ? this.fromName : this.toName].gradientById[toGradKey]
        }
        // strange morph behavior at 0 and 1
        if (percentage === 0) {
          newPath = fromPath
          viewBox = `0 0 ${this.fromViewBox.x} ${this.fromViewBox.y}`
          if (fromGrad || toGrad) {
            fill = lerpGradient(fromGrad || fromFill, toGrad || toFIll, percentage, this.charName)
          } else {
            fill = fromFill
          }
          if (!this.statics[this.charName][this.fromName].viewBox)
            this.statics[this.charName][this.fromName].viewBox = viewBox
        } else if (percentage === 1) {
          newPath = toPath
          viewBox = `0 0 ${this.toViewBox.x} ${this.toViewBox.y}`
          if (fromGrad || toGrad) {
            fill = lerpGradient(fromGrad || fromFill, toGrad || toFIll, percentage, this.charName)
          } else {
            fill = toFill
          }
          if (!this.statics[this.charName][this.toName].viewBox)
            this.statics[this.charName][this.toName].viewBox = viewBox
        } else {
          let x = this.fromViewBox.x + ((this.toViewBox.x - this.fromViewBox.x) * percentage)
          let y = this.fromViewBox.y + ((this.toViewBox.y - this.fromViewBox.y) * percentage)
          viewBox = `0 0 ${x} ${y}`
          if (fromGrad || toGrad) {
            fill = lerpGradient(fromGrad || fromFill, toGrad || toFIll, percentage, this.charName)
          } else {
            fill = lerpColor(fromFill, toFill, percentage)
          }
          // minimize floating of new shapes
          if (fromPath.endsWith('-0.1 0 z')) {
            let lim = ~~(this.timeframe / 2)
            if (timeframeIndex < lim) {
              percentage = 0
            } else {
              percentage = (timeframeIndex - (lim)) / (lim)
            }
          }
          if (toPath.endsWith('-0.1 0 z')) {
            let lim = ~~(this.timeframe / 10)
            if (timeframeIndex < lim) {
              percentage = (timeframeIndex - lim) / lim
            } else {
              percentage = 1
            }
          }
          newPath = morph(percentage)
        }
        this.bakedFrames[timeframeIndex][pathName] = {
          path: newPath,
          fill,
          remainder,
          additional,
          index
        }
        this.bakedFrames[timeframeIndex].viewBox = viewBox
      }
      this.pathIndex = pathIndex
    }
    if (this.pathIndex >= this.pathKeys.length) {
      this.bakeLooping = false
      this.bakes[this.charName][this.animName].push(this.bakedFrames)
      this.bakedFrames = []
    }
  }
}

export default new Loader