import cache from 'util/data/cache'
import updater from 'util/game/updater'
import { intParse } from 'util/data/helpers'
import hierarchy from 'util/game/hierarchy'
import dispatch from 'util/data/dispatch'

class Animator {
	constructor() {
		updater.register('animatorUpater', this.update, this)
		this.animations = []
		this.animationsById = {}
		this.notRealTime = true
		this.rtMultiplier = 1
		this.additionalsRendered = {}
		this.remaindersRemoved = {}
	}

	setStageCallback(cb) {
		this.stageCallback = cb
	}

	update(dt) {
		if (this.notRealTime) {
			if (dt > 16) {
				this.rtMultiplier = intParse((dt / 16))
			}
		}
		let gradients = hierarchy.getGradientsById()
		for (let i = 0; i < this.animations.length; i++) {
			let ani = this.animations[i]
			this.additionalsRendered[ani.name] = this.additionalsRendered[ani.name] || {}
			for (let pathKey in ani.bakes[ani.frameIndex][ani.loopIndex]) {
				let path = ani.bakes[ani.frameIndex][ani.loopIndex][pathKey],
					ent = ani.entity,
					child
				if (pathKey === 'viewBox') {
					continue
				}
				// update and new gradient
				if (path.fill.id) {
					gradients[ent.id].grads[path.fill.id] = {
						...path.fill
					}
				}
				// add additional paths into entity
				if (path.additional && !this.additionalsRendered[ani.name][pathKey]) {
					if (path.fill.id) {
						path.fill = `url(#${path.fill.id})`
					}
					ent.paths[pathKey] = {
						...path
					}
				}
				// 'remove' path by reducing it in size
				else if (path.remainder && !this.remaindersRemoved[pathKey]) {
					// hard hide 'removed' path
					if (path.d.endsWith(' -0.1 0 z')) {
						path.d = ''
					}
					ent.paths[pathKey].d = path.d
				}
				// update path based on bake
				else {
					ent.paths[pathKey].d = path.d
				}
			}
			if (ani.fitToWidth) {
				ani.entity.oldViewBox = ani.entity.viewBox
				ani.entity.viewBox = ani.bakes[ani.frameIndex][ani.loopIndex].viewBox
			}
			this.stageCallback(ani.entity)
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
							break
						case 'normal':
						case 'reverse':
							this.animations.splice(i, 1)
							i--
							break
					}
				}
			}
		}
	}

	replay() {
		this.reloadNotice.off()
		delete this.reloadNotice
		this.play(this.replayParams)
		delete this.replayParams
	}

	play({ entityId, name = 'default', type = 'normal', fitToWidth = true, from, to }) {
		let repeat = 0
		// TODO - figure out how to unbottleneck here
		let allBakes = cache.getBakes()
		if (!allBakes) {
			this.replayParams = arguments[0]
			this.reloadNotice = dispatch.on('reading complete', this.replay, this)
			return
		}
		let bakes = allBakes[entityId][name]
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
			repeat = intParse(type.replace('repeat', ''))
			type = 'repeat'
		} else if (type === 'frame') {
			from = intParse(from)
			to = intParse(to)
			bakes = bakes.slice(from, to)
		}
		this.animations.push(this.animationsById[name] = {
			type,
			fitToWidth,
			bakes,
			name,
			entity: hierarchy.getEntityById(entityId),
			frameIndex: 0,
			loopIndex: 0,
			repeatIndex: 0,
			repeatLimit: repeat
		})
	}

	kill(name) {
		this.animations.splice(this.animations.indexOf(this.animationsById[name]), 1)
		delete this.animationsById[name]
	}
}

export default new Animator
