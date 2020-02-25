// new cache
let cache = {
	GAME_DATA: {},
	USER_PREFERENCES: {},
	META_DATA: {},
	SVGS: {},
	SAVES: {},
	STAGE: {
		BACK: 'stageBack',
		MAIN: 'stageMain',
		FRONT: 'stageFront',
		SUPERFRONT: 'stageSuperfront',
		UI: 'stageUI'
	},
	DURATION: 1,
	IDLEFORCE: 1.8,
	IDLEDELAY: 0.2,
	WHITE: '#FFFFFF',
	ANIFRAME_LIMIT: 60,
	FILLER_PATH: 'M0,0L0.1,0L0.1,0Z',
	GROUND_LEVEL: 50,
	SCALER: 0.8,
	PLAYER_CHARACTER: 'esperanza',
	IDLE: 'idle',
	GLOBE: {
		N: 'y1',
		S: 'y2',
		E: 'x2',
		W: 'x1'
	},
	KEYBINDS: {
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
	},
	ANIMATION_KEYWORDS: {
		esperanza: {
			starter: 'stand',
			idle: 'idle',
			leftArm: 'leftPunch',
			rightArm: 'rightPunch'
		}
	}
}

export default cache
