import cache from 'util/cache'
import { interpolate } from 'flubber'
import polyfill from 'util/polyfill'
import { lerpColor, lerpGradient, objectAssignAll, intParse } from 'util/helpers'

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
				break
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
		this.SVGS.loadedSVGs = objectAssignAll(this.SVGS.loadedSVGs, this.loadedSVGs)
		this.SVGS.bakes = objectAssignAll(this.SVGS.bakes, this.bakes)
		this.SVGS.statics = objectAssignAll(this.SVGS.statics, this.statics)
		postMessage({ msg: 'loadingComplete', data: this.SVGS })
	}

	loadSVGs() {
		for (let setKey in this.svgs) {
			let svgSet = this.svgs[setKey]
			this.loadedSVGs[setKey] = {}
			this.statics[setKey] = {}
			svgLoop: for (let svgKey in svgSet) {
				if (svgKey === 'defaultId') {
					svgKey = 'defaultName'
				}
				if (this.SVGS.loadedSVGs[setKey] && this.SVGS.loadedSVGs[tKey][svgKey]) {
					console.log(`already cached svg ${svgKey}`)
					continue svgLoop
				}
				let location = svgSet[svgKey]
				let svg =
					this.loadedSVGs[setKey][svgKey] =
					require(`!!simple-svg-loader!svg/${location}.svg`).default({})
				this.loadedSVGs[setKey][svgKey].id = setKey
				this.statics[setKey][svgKey] = {}
				// if (!this.statics[setKey].id) {
				// 	this.statics[setKey].id = setKey
				// }
				if (!this.statics[setKey].defaultId) {
					this.statics[setKey].defaultId = svgKey
				}

				let reduceSvgChildrenToPaths = (children) => {
					for (let childIndex = 0; childIndex < children.length; childIndex++) {
						let child = children[childIndex]
						if (child.type === 'g') {
							reduceSvgChildrenToPaths(child.props.children)
						}
						if (child.type === 'path') {
							let { id, d, fill } = child.props
							if (fill && fill.startsWith('url(#')) {
								// bind this gradient to it's svg parent
								fill = fill.replace('url(#', `url(#${setKey}_${svgKey}_`)
							}
							svg.pathsById[id] = {
								id,
								d,
								fill,
								index: childIndex,
								indexLength: children.length
							}
							if (child.props.children.length) {
								console.warn('children paths inside paths!?!')
								reduceSvgChildrenToPaths(child.props.children)
							}
						}
					}
				}

				let reduceSvgGradients = (children) => {
					for (let childIndex = 0; childIndex < children.length; childIndex++) {
						let child = children[childIndex]
						if (child.type === 'defs') {
							let gradients = child.props.children
							this.statics[setKey][svgKey].grads = this.statics[setKey][svgKey].grads || {}
							for (let gradIndex = 0; gradIndex < gradients.length; gradIndex++) {
								let grad = gradients[gradIndex]
								// bind this gradient to it's svg parent
								grad.props.id = `${setKey}_${svgKey}_${grad.props.id}`
								svg.gradientsById[grad.props.id] = grad.props
							}
							this.statics[setKey][svgKey].grads = svg.gradientsById
						}
					}
				}

				let [, , width, height] = svg.props.viewBox.split(' ')
				svg.width = parseInt(width)
				svg.height = parseInt(height)
				svg.pathsById = {}
				svg.gradientsById = {}
				reduceSvgChildrenToPaths(svg.props.children)
				reduceSvgGradients(svg.props.children)
			}
		}
	}

	bakeSVGs() {
		for (let setKey in this.manifestAnimData) {
			let anims = this.manifestAnimData[setKey]
			this.bakes[setKey] = {}
			for (let animName in anims) {
				this.bakes[setKey][animName] = []
				let frames = anims[animName]
				for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
					let { from: fromName, to: toName, timeframe } = frames[frameIndex]
					let fromChildren = Object.values(this.loadedSVGs[setKey][fromName].pathsById)
					let fromViewBox = {
						x: this.loadedSVGs[setKey][fromName].props.viewBox.split(' ')[2] * 1,
						y: this.loadedSVGs[setKey][fromName].props.viewBox.split(' ')[3] * 1
					}
					let toChildren = Object.values(this.loadedSVGs[setKey][toName].pathsById)
					let toViewBox = {
						x: this.loadedSVGs[setKey][toName].props.viewBox.split(' ')[2] * 1,
						y: this.loadedSVGs[setKey][toName].props.viewBox.split(' ')[3] * 1
					}
					this.statics[setKey][fromName] = this.statics[setKey][fromName] || {}
					this.statics[setKey][toName] = this.statics[setKey][toName] || {}
					let pathsToBake = {}
					fromNameLoop: for (let fromIndex = 0; fromIndex < fromChildren.length; fromIndex++) {
						let { id: fromId, d: fromPath, fill: fromFill, index: fromPathIndex } = fromChildren[fromIndex]
						for (let toIndex = 0; toIndex < toChildren.length; toIndex++) {
							let { id: toPathName, d: toPath, fill: toFill, index: toPathIndex } = toChildren[toIndex]
							if (fromId === toPathName) {
								// matching paths
								pathsToBake[fromId] = {
									fromFill,
									fromPath,
									toFill,
									toPath,
									index: fromPathIndex
								}
								if (!this.statics[setKey][fromName].viewBox) {
									this.statics[setKey][fromName].paths = this.statics[setKey][fromName].paths || {}
									this.statics[setKey][fromName].paths[fromId] = {
										fill: fromFill,
										d: fromPath,
										index: fromPathIndex
									}
								}
								if (!this.statics[setKey][toName].viewBox) {
									this.statics[setKey][toName].paths = this.statics[setKey][toName].paths || {}
									this.statics[setKey][toName].paths[toPathName] = {
										fill: toFill,
										d: toPath,
										index: toPathIndex
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
						pathsToBake[fromId] = {
							fromFill,
							fromPath,
							toPath: fillerPath,
							toFill: fromFill,
							additional: true,
							index: fromPathIndex
						}
						if (!this.statics[setKey][fromName].viewBox) {
							this.statics[setKey][fromName].paths = this.statics[setKey][fromName].paths || {}
							this.statics[setKey][fromName].paths[fromId] = {
								fill: fromFill,
								d: fromPath,
								additional: true,
								index: fromPathIndex
							}
						}
					}
					for (let remainderIndex = 0; remainderIndex < toChildren.length; remainderIndex++) {
						let { d, id, fill } = toChildren[remainderIndex]
						let reMreplace = /M(\d*\.?\d*,\d*\.?\d*)[a-zA-Z,.]/g
						let test = reMreplace.exec(d)
						if (test === null) {
							reMreplace = /M(\d*\.?\d*\.?\d*)[a-zA-Z,.]/g
							test = reMreplace.exec(d)
						}
						let mReplace = `M${test[1]}`
						let fillerPath = cache.FILLER_PATH.replace('M -0.1 -0.1', mReplace)
						pathsToBake[id] = {
							toFill: fill,
							toPath: d,
							fromFill: fill,
							fromPath: fillerPath,
							remainder: true,
							index: this.loadedSVGs[setKey][toName].pathsById[id].index

						}
						if (!this.statics[setKey][toName].viewBox) {
							this.statics[setKey][toName].paths = this.statics[setKey][toName].paths || {}
							this.statics[setKey][toName].paths[id] = {
								fill: fill,
								d: d,
								remainder: true,
								index: this.loadedSVGs[setKey][toName].pathsById[id].index
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
								fromGrad = this.statics[setKey][remainder ? toName : fromName].grads[fromGradKey]
							}
							if (toFill.startsWith('url(#')) {
								let toGradKey = toFill.replace('url(#', '').replace(')', '')
								toGrad = this.statics[setKey][additional ? fromName : toName].grads[toGradKey]
							}
							// strange morph behavior at 0 and 1
							if (percentage === 0) {
								newPath = fromPath
								viewBox = `0 0 ${fromViewBox.x} ${fromViewBox.y}`
								if (fromGrad || toGrad) {
									fill = lerpGradient(fromGrad || fromFill, toGrad || toFill, percentage, setKey)
								} else {
									fill = fromFill
								}
								if (!this.statics[setKey][fromName].viewBox) {
									this.statics[setKey][fromName].viewBox = viewBox
									let [, , width, height] = viewBox.split(' ')
									this.statics[setKey][fromName].width = parseInt(width)
									this.statics[setKey][fromName].height = parseInt(height)
								}
							} else if (percentage === 1) {
								newPath = toPath
								viewBox = `0 0 ${toViewBox.x} ${toViewBox.y}`
								if (fromGrad || toGrad) {
									fill = lerpGradient(fromGrad || fromFill, toGrad || toFill, percentage, setKey)
								} else {
									fill = toFill
								}
								if (!this.statics[setKey][toName].viewBox) {
									this.statics[setKey][toName].viewBox = viewBox
									let [, , width, height] = viewBox.split(' ')
									this.statics[setKey][toName].width = parseInt(width)
									this.statics[setKey][toName].height = parseInt(height)
								}
							} else {
								let x = fromViewBox.x + ((toViewBox.x - fromViewBox.x) * percentage)
								let y = fromViewBox.y + ((toViewBox.y - fromViewBox.y) * percentage)
								viewBox = `0 0 ${x} ${y}`
								if (fromGrad || toGrad) {
									fill = lerpGradient(fromGrad || fromFill, toGrad || toFill, percentage, setKey)
								} else {
									fill = lerpColor(fromFill, toFill, percentage)
								}
								// minimize floating of new shapes
								if (fromPath.endsWith('-0.1 0 z')) {
									let lim = parseInt(timeframe / 2)
									if (timeframeIndex < lim) {
										percentage = 0
									} else {
										percentage = (timeframeIndex - (lim)) / (lim)
									}
								}
								if (toPath.endsWith('-0.1 0 z')) {
									let lim = parseInt(timeframe / 10)
									if (timeframeIndex < lim) {
										percentage = (timeframeIndex - lim) / lim
									} else {
										percentage = 1
									}
								}
								newPath = morph(percentage)
							}
							bakedFrames[timeframeIndex][pathName] = {
								d: newPath,
								fill,
								remainder,
								additional,
								index
							}
							bakedFrames[timeframeIndex].viewBox = viewBox
						}
					}
					this.bakes[setKey][animName].push(bakedFrames)
				}
			}
		}
	}
}

let loader = new Loader()
