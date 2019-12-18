import cache from 'util/cache'
import { interpolate } from 'flubber'
import * as Rematrix from 'rematrix'
import polyfill from 'util/polyfill'

import { lerpColor, lerpGradient, objectAssignAll } from 'util/helpers'

// test manifest, tobe defined by scene files
import mainManifest from 'data/scenes/_manifest'

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
				if (this.SVGS.loadedSVGs[setKey] && this.SVGS.loadedSVGs[tKey][svgKey]) {
					console.log(`already cached svg ${svgKey}`)
					continue svgLoop
				}
				let location = svgSet[svgKey]
				let svg = this.loadedSVGs[setKey][svgKey] = require(`!!preact-svg-loader!svg/${location}.svg`).default({})
				this.loadedSVGs[setKey][svgKey].id = setKey
				svg.childrenById = {}
				// TODO: adobe illustrator = .children[svg.props.children.length - 1].children[0].children
				// desired = .children
				for (let pathIndex = 0; pathIndex < svg.props.children[svg.props.children.length - 1].props.children[0].props.children.length; pathIndex++) {
					let path = svg.props.children[svg.props.children.length - 1].props.children[0].props.children[pathIndex]
					svg.childrenById[path.props.id] = path
					svg.childrenById[path.props.id].index = pathIndex
				}
				svg.gradientById = {}
				if (svg.props.children.length < 3) {
					continue
				}
				for (let gradIndex = 0; gradIndex < svg.props.children[0].props.children.length; gradIndex++) {
					let grad = svg.props.children[0].props.children[gradIndex]
					if (!grad.props.children[0] && grad.props['xlink:href']) {
						let refGradKey = grad.props['xlink:href'].replace('#', '')
						let gradRef = svg.gradientById[refGradKey]
						let child1 = { ...gradRef.props.children[0] }
						let child2 = { ...gradRef.props.children[1] }
						grad.props.children = [child1, child2]
						grad.props.gradientUnits = 'userSpaceOnUse'
						if (!grad.props.gradientTransform && gradRef.props.gradientTransform) grad.props.gradientTransform = gradRef.props.gradientTransform
						if (!grad.props.x1 && gradRef.props.x1) grad.props.x1 = gradRef.props.x1
						if (!grad.props.x2 && gradRef.props.x2) grad.props.x2 = gradRef.props.x2
						if (!grad.props.y1 && gradRef.props.y1) grad.props.y1 = gradRef.props.y1
						if (!grad.props.y2 && gradRef.props.y2) grad.props.y2 = gradRef.props.y2
						delete grad.props['xlink:href']
					}
					svg.gradientById[grad.props.id] = grad
					svg.gradientById[grad.props.id].index = gradIndex
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
					let fromChildren = Object.values(this.loadedSVGs[charName][fromName].childrenById)
					let fromViewBox = {
						x: this.loadedSVGs[charName][fromName].props.viewBox.split(' ')[2] * 1,
						y: this.loadedSVGs[charName][fromName].props.viewBox.split(' ')[3] * 1
					}
					let toChildren = Object.values(this.loadedSVGs[charName][toName].childrenById)
					let toViewBox = {
						x: this.loadedSVGs[charName][toName].props.viewBox.split(' ')[2] * 1,
						y: this.loadedSVGs[charName][toName].props.viewBox.split(' ')[3] * 1
					}
					this.statics[charName][fromName] = this.statics[charName][fromName] || {}
					this.statics[charName][toName] = this.statics[charName][toName] || {}
					let pathsToBake = {}
					fromNameLoop: for (let fromIndex = 0; fromIndex < fromChildren.length; fromIndex++) {
						let { id: fromPathName, d: fromPath, fill: fromFill } = fromChildren[fromIndex].props
						for (let toIndex = 0; toIndex < toChildren.length; toIndex++) {
							let { id: toPathName, d: toPath, fill: toFill } = toChildren[toIndex].props
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
						let test = reMreplace.exec(child.props.d)
						if (test === null) {
							reMreplace = /M(\d*\.?\d*\.?\d*)[a-zA-Z,.]/g
							test = reMreplace.exec(child.props.d)
						}
						let mReplace = `M${test[1]}`
						let fillerPath = cache.FILLER_PATH.replace('M -0.1 -0.1', mReplace)
						pathsToBake[child.props.id] = {
							toFill: child.props.fill,
							toPath: child.props.d,
							fromFill: child.props.fill,
							fromPath: fillerPath,
							remainder: true,
							index: this.loadedSVGs[charName][toName].childrenById[child.props.id].index

						}
						if (!this.statics[charName][toName].viewBox) {
							this.statics[charName][toName][child.props.id] = {
								fill: child.props.fill,
								path: child.props.d,
								remainder: true,
								index: this.loadedSVGs[charName][toName].childrenById[child.props.id].index
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