import { h, Component } from 'preact'
import style from './mainmenu.css'
import { route } from 'preact-router'
import animator from 'util/animator'
import cache from 'util/cache'
import input from 'util/input'
import dispatch from 'util/dispatch'
import updater from 'util/updater'
import { bindAll } from 'util/helpers'
import Button from 'components/ui/button'
import Stage from 'components/game/stage'

export default class MainMenu extends Component {
	constructor(props) {
		super(props)
		input.register('keydown', 'mainMenuKeydown', this.keydown, this)
		bindAll(this, ['play', 'testscene', 'pocademo', 'settings'])
		updater.register('mainMenuUpdate', this.update, this)
		this.deltaTime = 0
	}

	_exit() {
		updater.unregister('mainMenuUpdate')
		input.unregister('keydown', 'mainMenuKeydown')
		animator.kill('testAnimation')
	}

	keydown(event) {
		console.log('mainMenuKeydown', event)
	}

	settings() {
		this._exit()
		route('/settings')
	}

	testscene() {
		cache.META_DATA.exitRoute = '/testscene'
		cache.META_DATA.manifest = 'testScene'
		dispatch.send('fadeInBS', () => {
			this._exit()
			route('/')
		})
	}

	pocademo() {
		cache.META_DATA.exitRoute = '/pocademo'
		cache.META_DATA.manifest = 'pocaDemo'
		dispatch.send('fadeInBS', () => {
			this._exit()
			route('/')
		})
	}


	update(dt) {
		if (this.playMotions) {
			this.deltaTime += (dt / 4)
			let width, x, y, rotation
			width = ((this.deltaTime % 3000)) % 400
			x = ((this.deltaTime % 9000) / 9) % 500
			y = ((this.deltaTime % 9000) / 12) % 200
			rotation = (this.deltaTime % 1440) / 4
			this.setState({
				actors: {
					testObject: {
						svg: this.state.actors.testObject.svg,
						width: width + 'px',
						x: x + 'px',
						y: y + 'px',
						rotation
					}
				}
			})
		}
	}

	play(event) {
		event.stopPropagation()
		animator.play({
			actor: this.state.actors.testObject,
			name: 'testAnimation',
			type: 'pingpong'
		})
		// this.playMotions = true
	}

	componentDidMount() {
		dispatch.send('fadeOutBS')
		if (cache.SVGS.statics) {
			// initilize scene
			let actorsList = ['testObject'] //, 'testObject3']
			let actors = {}
			for (let act of actorsList) {
				let svg = cache.SVGS.statics[act]
				actors[act] = {
					id: act,
					svg,
					// setup position in the scene, x and y should be relevant to center of screen
					transform: {
						x: 0,
						y: 0,
						rotate: 0,
						scale: 1
					}
				}
			}
			this.setState({
				actors
			})
		}
	}

	render({}, { actors }) {
		return (actors &&
			<div class={style.mainWrap}>
				<div class={style.mainMenu}>
					<div class={style.mainMenuText}>Main Menu</div>
					<Button
						text='Play Test Animation'
						onClick={this.play}
					/>
					<Button
						text='Settings'
						onClick={this.settings}
					/>
					<Button
						text='Test Scene'
						onClick={this.testscene}
					/>
					<Button
						text='Poca Demo'
						onClick={this.pocademo}
					/>
					<p>copyright and trademark stuff</p>
				</div>
				{ actors &&
					<Stage class={style.stage}>
						{actors}
					</Stage>
				}
			</div>
		)
	}
}
