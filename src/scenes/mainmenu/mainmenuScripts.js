import { Howl, Howler } from 'howler'
import cache from 'util/data/cache'
import animator from 'util/game/animator'
import input from 'util/game/input'
import updater from 'util/game/updater'
import dispatch from 'util/data/dispatch'
import mainMenu from 'data/scenes/mainmenu'
import { route } from 'preact-router'
import physics from 'util/game/physics'

export function init() {
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

export function initilizeScene() {
	// only for reload
	if (!this.statics) {
		this.getStatics(true)
		return
	}
	// - only for reload
	let { isMute } = cache.USER_PREFERENCES.audio
	let entitiesList = [{
		id: 'colorChar',
		x: -150,
		anchor: [0, -1],
		scale: 0.8
	}]
	let entities = {}
	for (let act of entitiesList) {
		let { id = act, ...rest } = act
		let entity = this.statics[id]
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
		isMute: isMute || true
	})
	cache.USER_PREFERENCES.audio.isMute = isMute || true
	dispatch.send('fadeOutBS')
}

export function getStatics() {
	this.statics = cache.getStatics()
	// only for reload
	if (!this.statics) {
		this.reloadNotice = dispatch.on('reading complete', this.getStatics, this)
		return
	}
	else if (this.reloadNotice) {
		this.reloadNotice.off()
		delete this.reloadNotice
	}
	this.initilizeScene()
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
	let { isMute } = this.state
	if (isMute) {
		this.setState({
			isMute: false
		})
		Howler.ctx.resume()
		Howler.mute(false)
		playLoadingSound()
	}
	else {
		this.setState({
			isMute: true
		})
		Howler.mute(true)
	}
}

export function playLoadingSound() {
	const sound = new Howl({
		src: ['/assets/sounds/music/starcatcher.mp3']
	})
	sound.play()
}

export function update(dt) {
	if (this.playMotions) {
		this.data = mainMenu
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

export function settings () {
	this.exit()
	route('/settings')
}

export function demo() {
	cache.META_DATA.exitRoute = '/demo'
	cache.META_DATA.manifest = 'demo'
	dispatch.send('fadeInBS', () => {
		this.exit()
		route('/')
	})
}

export function pocademo() {
	cache.META_DATA.exitRoute = '/pocademo'
	cache.META_DATA.manifest = 'pocaDemo'
	dispatch.send('fadeInBS', () => {
		this.exit()
		route('/')
	})
}

export function exit() {
	updater.unregister('mainMenuUpdate')
	input.unregister('keydown', 'mainMenuKeydown')
	animator.kill('testAnimation')
}
