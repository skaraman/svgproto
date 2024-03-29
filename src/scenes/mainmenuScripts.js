import { Howl, Howler } from 'howler'
import cache from 'util/data/cache'
import animator from 'util/game/animator'
import input from 'util/game/input'
import updater from 'util/game/updater'
import dispatch from 'util/data/dispatch'
import physics from 'util/game/physics'
import hierarchy from 'util/game/hierarchy'
import { isDefined } from 'util/data/helpers'
import audio from 'util/game/audio'

import sceneData from 'data/scenes/mainmenu'

export function init() {
	if (this.props.ready) {
		input.register(
			'keydown',
			'mainMenuKeydown',
			this.keydown,
			this
		)
		updater.register(
			'mainMenuUpdate',
			this.update,
			this
		)
		this.getStatics()
	}
}

export function componentDidUpdate(prevProps) {
	if (
		this.props.ready &&
		this.props.ready !== prevProps.ready
	) {
		this.initScene()
	}
}

export function initScene() {
	// only for reload
	if (!this.statics) {
		this.getStatics(true)
		return
	}
	// - only for reload
	// autoplay policy bs
	let {
		isMute,
		musicPlaying
	} = cache.USER_PREFERENCES.audio
	if (!isDefined(isMute)) {
		isMute = true
	}
	if (!isDefined(musicPlaying)) {
		musicPlaying = false
	}
	let entitiesList = [{
		id: 'colorChar',
		ref: 'colorChar',
		x: -200,
		anchor: [0, -1],
		scale: 0.8
	}]
	let stressNumber = 29
	for (let i = 0; i < stressNumber; i++) {
		entitiesList.push({
			id: 'colorChar' + i,
			ref: 'colorChar',
			x: -300 + ((i + 1) * 10),
			anchor: [0, -1],
			scale: 0.8
		})
	}
	entitiesList.push({
		id: 'colorCharX',
		ref: 'colorCharX',
		x: 0,
		y: 100,
		anchor: [0, -1],
		scale: 0.8
	})

	let entities = {}
	for (let act of entitiesList) {
		let { id, ref, ...rest } = act
		let entity = this.statics[ref]
		entities[id] = {
			id,
			entity,
			transform: {
				...rest
			}
		}
	}
	this.setState({
		entities,
		isMute,
		musicPlaying
	})
	cache.USER_PREFERENCES.audio.isMute = isMute
	cache.USER_PREFERENCES.audio.musicPlaying = musicPlaying
	dispatch.send('fadeOutBS')
}

export function getStatics() {
	this.statics = cache.getStatics()
	// only for reload
	if (!this.statics) {
		this.reloadNotice = dispatch.on(
			'reading complete',
			this.getStatics,
			this
		)
		return
	} else if (this.reloadNotice) {
		this.reloadNotice.off()
		delete this.reloadNotice
	}
	this.initScene()
	// - only for reload
}

export function playAnimation(event) {
	event.stopPropagation()
	animator.play({
		entityId: 'colorChar',
		name: 'powerUp',
		type: 'repeat'
	})
	// this.playMotions = true
}

export function stopAnimation(event) {
	event.stopPropagation()
	animator.kill('colorChar', 'powerUp')
}

export function toggleMute() {
	let isMute = audio.toggleMute()
	this.setState({
		isMute
	})
	let { musicPlaying } = this.state
	if (!musicPlaying) {
		this.playMusic()
	}
}

export function playMusic() {
	let musicPlaying = audio.play(
		sceneData.sounds.musics.main,
		'music'
	)
	cache.USER_PREFERENCES.audio.musicPlaying = musicPlaying
	this.setState({
		musicPlaying
	})
}

export function update(dt) {
	if (this.playMotions) {
		this.deltaTime += (dt / 4)
		let width, x, y, rotation
		width = ((this.deltaTime % 3000)) % 400
		x = ((this.deltaTime % 9000) / 9) % 500
		y = ((this.deltaTime % 9000) / 12) % 200
		rotation = (this.deltaTime % 1440) / 4
		this.setState({
			entities: {
				testObject: {
					entity: this.state.entities.testObject.entity,
					width: width + 'px',
					x: x + 'px',
					y: y + 'px',
					rotation
				}
			}
		})
	}
}

export function keydown(event) {
	console.log('mainMenuKeydown', event)
}

export function settings() {
	dispatch.send('route', '/settings')
}

export function demo() {
	cache.META_DATA.exitRoute = '/demo'
	cache.META_DATA.manifest = 'demo'
	dispatch.send('fadeInBS', () => {
		dispatch.send('route', '/')
	})
}

export function pocademo() {
	cache.META_DATA.exitRoute = '/pocademo'
	cache.META_DATA.manifest = 'pocaDemo'
	dispatch.send('fadeInBS', () => {
		dispatch.send('route', '/')
	})
}

export function componentWillUnmount() {
	updater.unregister('mainMenuUpdate')
	input.unregister('keydown', 'mainMenuKeydown')
	animator.kill('testAnimation')
	hierarchy.removeAll()
}
