class Cache {
	constructor() {
		_setDefaults()
	}

	_setDefaults() {
		this.GAME_DATA = {}
		this.USER_PREFERENCES = {}
		this.META_DATA = {
			ssSKey: '_gameSvgStaticsStorageKey',
			sbSKey: '_gameSvgBakesStorageKey'
		}
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

	getStatics() {
		let statics = this.SVGS.statics
		if (!statics && cache.META_DATA.isReload) {
			statics = JSON.parse(localStorage.getItem(this.META_DATA.ssSKey))
		}
		return statics
	}

	getBakes() {
		let bakes = this.SVGS.bakes
		if (!bakes && cache.META_DATA.isReload) {
			bakes = JSON.parse(localStorage.getItem(this.META_DATA.sbSKey))
		}
		return bakes
	}

	setSVGS(svgs) {
		this.setStatics(svgs.statics)
		this.setBakes(svgs.bakes)
	}

	setStatics(statics) {
		this.SVGS.statics = statics
		debugger
		localStorage.setItem(cache.META_DATA.ssSKey, JSON.stringify(statics))
	}

	setBakes(bakes) {
		this.SVGS.bakes = bakes
		debugger
		localStorage.setItem(cache.META_DATA.sbSKey, JSON.stringify(bakes))
	}

}
let cache = new Cache
export default cache
