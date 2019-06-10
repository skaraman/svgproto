import cache from 'util/cache'
import { interpolate } from 'flubber'
import * as Rematrix from 'rematrix'

import dispatch from 'util/dispatch'
import { lerpColor, lerpGradient, objectAssignAll } from 'util/helpers'

// test manifest, tobe defined by scene files
import mainManifest from 'data/_manifest'

const detail = 1

export default class Loader {
  constructor() {
    self.addEventListener('message', (e) => this.onmessage(e, this))
    updater.register('loaderUpdate', this.update, this)
    cache.SVGS = { loadedSVGs: {}, bakes: {}, statics: {} }
  }

  onmessage(event, target) {
    console.log('Worker: Message received from main script')
    let args = event.data
    if (!args.type) this[args](cache.META_DATA.manifest)
  }

  load(manifest) {
    this.manifestData = mainManifest[manifest]
    this.bakes = {}
    this.loadedSVGs = {}
    this.statics = {}
    this.svgs = this.manifestData.objects
    this.manifestAnimData = this.manifestData.animations
    this.loadSVGs()
    this.autoBake()
  }

  _cache() {
    // TODO - fix 'default' in statics in loader.js
    cache.SVGS.loadedSVGs = objectAssignAll(cache.SVGS.loadedSVGs, this.loadedSVGs)
    cache.SVGS.bakes = objectAssignAll(cache.SVGS.bakes, this.bakes)
    cache.SVGS.statics = objectAssignAll(cache.SVGS.statics, this.statics)
    dispatch.send('loadingComplete')
  }

  loadSVGs() {
    for (let setKey in this.svgs) {
      let svgSet = this.svgs[setKey]
      this.loadedSVGs[setKey] = {}
      svgLoop: for (let svgKey in svgSet) {
        if (cache.SVGS.loadedSVGs[setKey] && cache.SVGS.loadedSVGs[setKey][svgKey]) {
          console.log(`already cached svg ${svgKey}`)
          continue svgLoop
        }
        let path = svgSet[svgKey]
        let svg = this.loadedSVGs[setKey][svgKey] = require(`!!preact-svg-loader!svg/${path}.svg`).default({})
        this.loadedSVGs[setKey][svgKey].id = setKey
        svg.childrenById = {}
        // TODO: adobe illustrator = .children[svg.children.length - 1].children[0].children
        // desired = .children
        for (let pathIndex = 0; pathIndex < svg.children[svg.children.length - 1].children[0].children.length; pathIndex++) {
          let path = svg.children[svg.children.length - 1].children[0].children[pathIndex]
          svg.childrenById[path.attributes.id] = path
          svg.childrenById[path.attributes.id].index = pathIndex
        }
        svg.gradientById = {}
        if (svg.children.length < 3) {
          continue
        }
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
  }

  autoBake() {
      for (let charName in this.manifestAnimData) {
        let animations = this.manifestAnimData[charName]
        this.statics[charName] = this.statics[charName] || {}
        this.animKeys = Object.keys(this.charDmjn nj, 98, ., /ata)
          this.animIndex = 0 this.animLimit = 1 this._forAnim()
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
          // TODO: adobe illustrator = .children[svg.children.length - 1].children[0].children
          // desired = .children
          this.fromChildren = this.loadedSVGs[this.charName][this.fromName].children[this.loadedSVGs[this.charName][this.fromName].children.length - 1].children[0].children.copy()
          this.fromIndex = 0
          this.fromLimit = 2
          this.fromViewBox = {
            x: this.loadedSVGs[this.charName][this.fromName].attributes.viewBox.split(' ')[2] * 1,
            y: this.loadedSVGs[this.charName][this.fromName].attributes.viewBox.split(' ')[3] * 1
          }
          this.toChildren = this.loadedSVGs[this.charName][this.toName].children[this.loadedSVGs[this.charName][this.toName].children.length - 1].children[0].children.copy()
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
          }
          this.bakes[this.charName][this.animName].push(this.bakedFrames)
        }
      }

      // let loader = new Loader()
      // export default loader
      // export default onmessage = function (e) {
      //   debugger
      //   console.log('Worker: Message received from main script')
      //   let args = e.data
      // }