import input from 'util/game/input'
import updater from 'util/game/updater'
import dispatch from 'util/data/dispatch'
import animator from 'util/game/animator'
import cache from 'util/data/cache'
import { worker } from 'util/data/worker'

import sceneData from 'data/scenes/loading'

const LOADER = worker('loader', ['loadingComplete', 'loadingProgress'])
const LOADING_TEXT = [
	'Loading...',
	`Loading ..`,
	`Loading  .`,
	'Loading   ',
	'Loading.  ',
	'Loading.. '
]

export function initilize(statics) {
	this.loader = LOADER
	input.register(
		'keydown',
		'loadingKeydown',
		this.keydown,
		this
	)
	updater.register(
		'loadingUpdate',
		this.update,
		this
	)
	this.on = [
		dispatch.on(
			'loadingComplete',
			this.loadingComplete,
			this
		),
		dispatch.on(
			'loadingProgress',
			this.loadingProgress,
			this
		),
		dispatch.on(
			'fs success',
			this.fsReady,
			this
		)
	]
	this.setState({
		deltaTime: 0,
		notRealTime: true,
		it: 0
	})
	dispatch.send('fadeOutBS')
	if (!cache.META_DATA.manifest ||
		!cache.META_DATA.exitRoute) {
		throw `Initial loading loop flaw`
	}
	// first loading loop doesn't have any cached SVGs, this should be used as the Initial
	// black screen during which company logos and loading scenes/aniamtions can be loaded
	if (statics && statics.loadingCircle) {
		// all subbsequent loading loops should show an animated loading screen
		let entity = statics.loadingCircle['1']
		let entities = {
			actors: {
				loadingCircle: {
					entity,
					width: '200px',
					right: '50px',
					bottom: '50px',
					rotation: 0
				}
			}
		}
		animator.play({
			entityId: 'loadingCircle',
			name: 'loadingAnimation',
			type: 'loop'
		})
		this.setState({
			entities
		})
	}
	this.loader.postMessage({ msg: 'load', data: cache.META_DATA.manifest })
}

export function update(dt) {
	let { loadingText, notRealTime, deltaTime, it } = this.state
	if (notRealTime) {
		if (dt > 16) {
			dt = 16
		}
	}
	deltaTime += dt
	if (deltaTime > 500) {
		loadingText = LOADING_TEXT[it]
		it++
		if (it >= LOADING_TEXT.length) {
			it = 0
		}
		deltaTime = 0
	}
	this.setState({
		loadingText,
		it,
		deltaTime
	})
}

export function loadingComplete(svgs) {
	console.log('Loading Completed')
	this.lc = true
	this.svgs = svgs
	this.attemptLoadingDone()
}

export function loadingProgress({ progress, total }) {
	this.setState({
		progress,
		total
	})
}

export function fsReady() {
	console.log('File System Ready')
	this.fsr = true
	this.attemptLoadingDone()
}


export function keydown(event) {
	console.log('loadingKeydown', event)
}

export function attemptLoadingDone() {
	if (this.fsr === true && this.lc === true) {
		cache.setSVGS(this.svgs)
		this.statics = this.svgs.statics
		dispatch.send('svgs ready')
		dispatch.send('fadeInBS', this.exit)
	}
}

export function exit() {
	input.unregister('keydown', 'loadingKeydown')
	updater.unregister('loadingUpdate')
	animator.kill('loadingAnimation')
	for (let o = 0; o < this.on.length; o++) {
		this.on[o].off()
	}
	this.on = []
	dispatch.send('route', cache.META_DATA.exitRoute, location.search)
}
