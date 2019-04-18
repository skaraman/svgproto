// new cache
module.exports = {
    SVGS: {},
    SAVES: {},
    STAGE: {
        BACK: 'stageBack',
        MAIN: 'stageMain',
        FRONT: 'stageFront',
        SUPERFRONT: 'stageSuperfront',
        UI: 'stageUI'
    },
    // global duration adjuster
    DURATION: 1,
    IDLEFORCE: 1.8,
    IDLEDELAY: 0.2,
    DISABLED_STROKE_COLOR: 'rgba(0, 0, 0, 0)',
    WHITE: 'rgba(255, 255, 255, 255)',
    ANIFRAME_LIMIT: 60,
    FILLER_PATH: 'M -0.1 -0.1 l 0.1 0 l 0 0.1 l -0.1 0 z',
    GROUND_LEVEL: 50,
    SCALER: .8,
    GD_TOKEN: '_Zz',
    PLAYER_CHARACTER: 'esperanza',
    IDLE: 'idle',
    GLOBLE: {
        N: 'y1',
        S: 'y2',
        E: 'x2',
        W: 'x1'
    },
    MSG: { // multi use, no return
        loadComplete: 'loadComplete',
        loadEnvironment: 'loadEnvironment',
        start: 'start',
        step: 'step',
        svgFin: 'svgFin',
        stressTest: 'stressTest',
        addToStage: 'addToStage',
        saveData: 'saveData'
    },
    SINGLE_USE_MSG: { // single use, returns
        getStage: 'getStage',
        getPlayerCharacter: 'getPlayerCharacter'
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
