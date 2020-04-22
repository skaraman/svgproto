import { h, Component } from 'preact'
import style from './demo.css'
import cache from 'util/data/cache'
import dispatch from 'util/data/dispatch'
import updater from 'util/game/updater'
import input from 'util/game/input'
import animator from 'util/game/animator'
import { bindAll } from 'util/data/helpers'
import Stage from 'components/game/stage'

export default class Demo extends Component {
	constructor(props) {
		super(props)
		updater.register('testsceneUpdate', this._update, this)
		input.register('keydown', 'testsceneKeydown', this._keydown, this)
		input.register('keyup', 'testsceneKeyup', this._keyup, this)
		// input.register('keypress', 'testsceneKeypress', this.keypress, this)
		bindAll(this, ['updateTime', 'setAnimationState'])
		this.deltaTime = 0
		cache.GAME_DATA.testscene = cache.GAME_DATA.testscene || {}
		// TODO: rig up player input control
		// TODO: figure out mutltiple keystrokes at once (keydown but not keyup, how many keydowns?)
	}

	componentWillMount() {
		this.setState({
			actors: {
				esperanza: {
					svg: cache.SVGS.loadedSVGs.esperanza.stand,
					scale: 0.6,
					x: '0px',
					y: '0px',
					rotation: '0deg'
				},
				hitObject: {
					svg: cache.SVGS.loadedSVGs.hitObject.circle,
					scale: 0.4,
					x: '260px',
					y: '300px'
				}
			},
			time: Date.now(),
			count: cache.GAME_DATA.testscene.count = cache.GAME_DATA.testscene.count || 10
		})
		let names = {
			esperanza: 'stand',
			hitObject: 'circle'
		}
		for (let adx in this.state.actors) {
			animator.setStaticFrame(this.state.actors[adx].svg, this._setAnimationState, names[adx])
		}
		// TODO: move esperanza to 'GROUND_LEVEL'
		// // TODO:  add basic collision detection
	}

	// gets called when this route is navigated to
	componentDidMount() {
		// start a timer for the clock:
		this.timer = true
		dispatch.send('fadeOutBS')
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		updater.unregister('testsceneUpdate')
	}

	_update(dt) {
		// if (!this.timer) return
		// this.deltaTime += dt
		// if (this.deltaTime > 1000) this.updateTime()
	}

	_keydown(event) {
		console.log('testsceneKeydown', event)
		switch (event.code) {
		case 'KeyD':
			animator.play({
				svg: this.state.actors.esperanza.svg,
				stateCallback: this._setAnimationState,
				name: 'leftPunch',
				type: 'regular'
			})
			break
		case 'KeyF':
			animator.play({
				svg: this.state.actors.esperanza.svg,
				stateCallback: this._setAnimationState,
				name: 'rightPunch',
				type: 'regular'
			})
			break
		}
	}

	_keyup(event) {
		console.log('testsceneKeyup', event)
	}

	// keypress(event) {
	//     console.log('testsceneKeypress', event)
	// }

	updateTime() {
		this.setState({
			time: Date.now()
		})
		this.deltaTime = 0
	}

	setAnimationState(svg, fitToSize) {
		let stateSvg = this.state.actors[svg.id]
		let state = this.state
		let actors = this.state.actors
		this.setState({
			...state,
			actors: {
				...actors,
				[svg.id]: {
					...stateSvg,
					svg
				}
			}
		})
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count, actors }) {
		return (
			<div class={style.scene}>
				{
					(actors) &&
					<Stage class={style.stage}>
						{actors}
					</Stage>
				}
				<div class={style.effects}>
					<h1>Profile: {user}</h1>
					<p>This is the user profile for a user named { user }.</p>
					<div>Current time: {new Date(time).toLocaleString()}</div>
				</div>
			</div>
		)
	}
}
