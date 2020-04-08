import { setup } from 'util/data/setup'
import dispatch from 'util/data/dispatch'

let files = setup('files', ['readingComplete', 'fsSuccess'])

class Cache {
	constructor() {
		this.files = files
		this._setDefaults()
		this.on = [
			dispatch.on('readingComplete', this.readingComplete, this),
			dispatch.on('fsSuccess', this.fsSuccess, this)
		]
	}

	_setDefaults() {
		this.GAME_DATA = {}
		this.USER_PREFERENCES = {}
		this.META_DATA = {}
		this.SVGS = {}
		this.SAVES = {}
		this.STAGE = {
			BACK: 'stageBack',
			MAIN: 'stageMain',
			FRONT: 'stageFront',
			SUPERFRONT: 'stageSuperfront',
			UI: 'stageUI'
		}
		this.DURATION = 1
		this.IDLEFORCE = 1.8
		this.IDLEDELAY = 0.2
		this.WHITE = '#FFFFFF'
		this.ANIFRAME_LIMIT = 60
		this.FILLER_PATH = 'M0,0L0.1,0L0.1,0Z'
		this.GROUND_LEVEL = 50
		this.SCALER = 0.8
		this.PLAYER_CHARACTER = 'esperanza'
		this.IDLE = 'idle'
		this.GLOBE = {
			N: 'y1',
			S: 'y2',
			E: 'x2',
			W: 'x1'
		}
		this.KEYBINDS = {
			'gamescene': {
				'ArrowLeft': 'left',
				'ArrowRight': 'right',
				'ArrowUp': 'up',
				'ArrowDown': 'down',

				' ': 'jump',
				'f': 'rightArm',
				'd': 'leftArm',
				's': 'rightLeg',
				'a': 'leftLeg'
			}
		}
		this.ANIMATION_KEYWORDS = {
			esperanza: {
				starter: 'stand',
				idle: 'idle',
				leftArm: 'leftPunch',
				rightArm: 'rightPunch'
			}
		}
	}

	fsSuccess() {
		dispatch.send('fs success')
	}

	readingComplete({ name, text }) {
		let data = JSON.parse(text)
		if (name === 'statics.txt') {
			this.SVGS.statics = data
		}
		if (name === 'bakes.txt') {
			this.SVGS.bakes = data
		}
		console.log('Reading Complete')
		dispatch.send('reading complete', data)
	}

	getStatics() {
		let statics = this.SVGS.statics
		if (!statics && cache.META_DATA.isReload) {
			this.files.postMessage({ msg: 'read', data: 'statics.txt' })
		}
		return statics
	}

	getBakes() {
		let bakes = this.SVGS.bakes
		if (!bakes && cache.META_DATA.isReload) {
			this.files.postMessage({ msg: 'read', data: 'bakes.txt' })
		}
		return bakes
	}

	setSVGS(svgs) {
		this.setStatics(svgs.statics)
		this.setBakes(svgs.bakes)
	}

	setStatics(statics) {
		this.SVGS.statics = statics
		this.files.postMessage({ msg: 'write', data: { name: 'statics.txt', text: JSON.stringify(statics) }})
	}

	setBakes(bakes) {
		this.SVGS.bakes = bakes
		this.files.postMessage({ msg: 'write', data: { name: 'bakes.txt', text: JSON.stringify(bakes) }})
	}
}

let cache = new Cache
export default cache
