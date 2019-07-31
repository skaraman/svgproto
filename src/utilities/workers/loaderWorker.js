import cache from 'util/cache'
import { interpolate } from 'flubber'
import * as Rematrix from 'rematrix'
import polyfill from 'util/polyfill'

import { lerpColor, lerpGradient, objectAssignAll } from 'util/helpers'

// test manifest, tobe defined by scene files
import mainManifest from 'data/_manifest'

const detail = 1

class Loader {
	constructor() {
		self.addEventListener('message', event => {
			if (event.data && !event.data.msg) {
				return
			}
			switch (event.data.msg) {
			case 'load':
				this.load(event.data.data)
				break;
			}
		})
		this.SVGS = { loadedSVGs: {}, bakes: {}, statics: {} }
	}

	load(manifest) {
		this.manifestData = mainManifest[manifest]
		this.bakes = {}
		this.loadedSVGs = {}
		this.statics = {}
		this.svgs = this.manifestData.objects
		this.manifestAnimData = this.manifestData.animations
		this.loadSVGs()
		this.bakeSVGs()
		this._cache()
	}

	_cache() {
		// TODO - fix 'default' in statics in loader.js
		this.SVGS.loadedSVGs = objectAssignAll(this.SVGS.loadedSVGs, this.loadedSVGs)
		this.SVGS.bakes = objectAssignAll(this.SVGS.bakes, this.bakes)
		this.SVGS.statics = objectAssignAll(this.SVGS.statics, this.statics)
		postMessage({ msg: 'loadingComplete', data: this.SVGS })
	}

	loadSVGs() {
		for (let setKey in this.svgs) {
			let svgSet = this.svgs[setKey]
			this.loadedSVGs[setKey] = {}
			svgLoop: for (let svgKey in svgSet) {
				if (this.SVGS.loadedSVGs[setKey] && this.SVGS.loadedSVGs[setKey][svgKey]) {
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

	bakeSVGs() {
		for (let charName in this.manifestAnimData) {
			let anims = this.manifestAnimData[charName]
			this.bakes[charName] = {}
			this.statics[charName] = this.statics[charName] || {}
			for (let animName in anims) {
				this.bakes[charName][animName] = []
				let frames = anims[animName]
				for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
					let { from: fromName, to: toName, timeframe } = frames[frameIndex]
					let fromChildren = this.loadedSVGs[charName][fromName].children[this.loadedSVGs[charName][fromName].children.length - 1].children[0].children.copy()
					let fromViewBox = {
						x: this.loadedSVGs[charName][fromName].attributes.viewBox.split(' ')[2] * 1,
						y: this.loadedSVGs[charName][fromName].attributes.viewBox.split(' ')[3] * 1
					}
					let toChildren = this.loadedSVGs[charName][toName].children[this.loadedSVGs[charName][toName].children.length - 1].children[0].children.copy()
					let toViewBox = {
						x: this.loadedSVGs[charName][toName].attributes.viewBox.split(' ')[2] * 1,
						y: this.loadedSVGs[charName][toName].attributes.viewBox.split(' ')[3] * 1
					}
					this.statics[charName][fromName] = this.statics[charName][fromName] || {}
					this.statics[charName][toName] = this.statics[charName][toName] || {}
					let pathsToBake = {}
					fromNameLoop: for (let fromIndex = 0; fromIndex < fromChildren.length; fromIndex++) {
						let { id: fromPathName, d: fromPath, fill: fromFill } = fromChildren[fromIndex].attributes
						for (let toIndex = 0; toIndex < toChildren.length; toIndex++) {
							let { id: toPathName, d: toPath, fill: toFill } = toChildren[toIndex].attributes
							if (fromPathName === toPathName) {
								// matching paths
								pathsToBake[fromPathName] = {
									fromFill,
									fromPath,
									toFill,
									toPath,
									index: this.loadedSVGs[charName][fromName].childrenById[fromPathName].index
								}
								if (!this.statics[charName][fromName].viewBox) {
									this.statics[charName][fromName][fromPathName] = {
										fill: fromFill,
										path: fromPath,
										index: this.loadedSVGs[charName][fromName].childrenById[fromPathName].index
									}
								}
								if (!this.statics[charName][toName].viewBox) {
									this.statics[charName][toName][toPathName] = {
										fill: toFill,
										path: toPath,
										index: this.loadedSVGs[charName][toName].childrenById[toPathName].index
									}
								}
								toChildren.splice(toIndex, 1)
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
						pathsToBake[fromPathName] = {
							fromFill,
							fromPath,
							toPath: fillerPath,
							toFill: fromFill,
							additional: true,
							index: this.loadedSVGs[charName][fromName].childrenById[fromPathName].index
						}
						if (!this.statics[charName][fromName].viewBox) {
							this.statics[charName][fromName][fromPathName] = {
								fill: fromFill,
								path: fromPath,
								additional: true,
								index: this.loadedSVGs[charName][fromName].childrenById[fromPathName].index
							}
						}
					}
					for (let remainderIndex = 0; remainderIndex < toChildren.length; remainderIndex++) {
						let child = toChildren[remainderIndex]
						let reMreplace = /M(\d*\.?\d*,\d*\.?\d*)[a-zA-Z,.]/g
						let test = reMreplace.exec(child.attributes.d)
						if (test === null) {
							reMreplace = /M(\d*\.?\d*\.?\d*)[a-zA-Z,.]/g
							test = reMreplace.exec(child.attributes.d)
						}
						let mReplace = `M${test[1]}`
						let fillerPath = cache.FILLER_PATH.replace('M -0.1 -0.1', mReplace)
						pathsToBake[child.attributes.id] = {
							toFill: child.attributes.fill,
							toPath: child.attributes.d,
							fromFill: child.attributes.fill,
							fromPath: fillerPath,
							remainder: true,
							index: this.loadedSVGs[charName][toName].childrenById[child.attributes.id].index

						}
						if (!this.statics[charName][toName].viewBox) {
							this.statics[charName][toName][child.attributes.id] = {
								fill: child.attributes.fill,
								path: child.attributes.d,
								remainder: true,
								index: this.loadedSVGs[charName][toName].childrenById[child.attributes.id].index
							}
						}
					}
					let bakedFrames = []
					for (let pathName in pathsToBake) {
						let { fromPath, toPath, fromFill, toFill, remainder, additional, index } = pathsToBake[pathName]
						let morph = interpolate(fromPath, toPath, { maxSegmentLength: detail })
						// for the prefered amount of shapeframes between the keyframes
						for (let timeframeIndex = 0; timeframeIndex < timeframe; timeframeIndex++) {
							bakedFrames[timeframeIndex] = bakedFrames[timeframeIndex] || {}
							let percentage = (1 / (timeframe - 1)) * timeframeIndex,
								newPath, viewBox, fill, fromGrad = false,
								toGrad = false
							if (fromFill.startsWith('url(#')) {
								let fromGradKey = fromFill.replace('url(#', '').replace(')', '')
								fromGrad = this.loadedSVGs[charName][remainder ? toName : fromName].gradientById[fromGradKey]
							}
							if (toFill.startsWith('url(#')) {
								let toGradKey = toFill.replace('url(#', '').replace(')', '')
								toGrad = this.loadedSVGs[charName][additional ? fromName : toName].gradientById[toGradKey]
							}
							// strange morph behavior at 0 and 1
							if (percentage === 0) {
								newPath = fromPath
								viewBox = `0 0 ${fromViewBox.x} ${fromViewBox.y}`
								if (fromGrad || toGrad) {
									fill = lerpGradient(fromGrad || fromFill, toGrad || toFIll, percentage, charName)
								} else {
									fill = fromFill
								}
								if (!this.statics[charName][fromName].viewBox)
									this.statics[charName][fromName].viewBox = viewBox
							} else if (percentage === 1) {
								newPath = toPath
								viewBox = `0 0 ${toViewBox.x} ${toViewBox.y}`
								if (fromGrad || toGrad) {
									fill = lerpGradient(fromGrad || fromFill, toGrad || toFIll, percentage, charName)
								} else {
									fill = toFill
								}
								if (!this.statics[charName][toName].viewBox)
									this.statics[charName][toName].viewBox = viewBox
							} else {
								let x = fromViewBox.x + ((toViewBox.x - fromViewBox.x) * percentage)
								let y = fromViewBox.y + ((toViewBox.y - fromViewBox.y) * percentage)
								viewBox = `0 0 ${x} ${y}`
								if (fromGrad || toGrad) {
									fill = lerpGradient(fromGrad || fromFill, toGrad || toFIll, percentage, charName)
								} else {
									fill = lerpColor(fromFill, toFill, percentage)
								}
								// minimize floating of new shapes
								if (fromPath.endsWith('-0.1 0 z')) {
									let lim = ~~(timeframe / 2)
									if (timeframeIndex < lim) {
										percentage = 0
									} else {
										percentage = (timeframeIndex - (lim)) / (lim)
									}
								}
								if (toPath.endsWith('-0.1 0 z')) {
									let lim = ~~(timeframe / 10)
									if (timeframeIndex < lim) {
										percentage = (timeframeIndex - lim) / lim
									} else {
										percentage = 1
									}
								}
								newPath = morph(percentage)
							}
							bakedFrames[timeframeIndex][pathName] = {
								path: newPath,
								fill,
								remainder,
								additional,
								index
							}
							bakedFrames[timeframeIndex].viewBox = viewBox
						}
					}
					this.bakes[charName][animName].push(bakedFrames)
				}
			}
		}
	}
}

let loader = new Loader()