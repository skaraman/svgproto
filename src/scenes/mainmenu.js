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

	play(event) {
		event.stopPropagation()
		animator.play({
			svg: this.state.actors.testObject.svg,
			name: 'testAnimation',
			type: 'pingpong'
		})
		this.playMotions = true
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

	componentWillMount() {
		dispatch.send('fadeOutBS')
		this.setState({
			actors: {
				testObject: {
					svg: cache.SVGS.loadedSVGs.testObject.box,
					width: 300,
					x: 0,
					y: 0,
					rotation: 0
				}
			}
		})
		animator.setStaticFrame(this.state.actors.testObject.svg, 'box', (svg) => {
			let stateSvg = this.state[svg.id]
			this.setState({
				[svg.id]: {
					...stateSvg,
					svg
				}
			})
		})
	}

	render({}, { actors }) {
		return (
			<div class={style.mainWrap}>
				<div class={style.mainMenu}>
					<div class={style.mainMenuText}>Main Menu</div>
					<Button
						text='Start Game'
						onClick={this.testscene}
					/>
					<Button
						text='Settings'
						onClick={this.settings}
					/>
					<Button
						text='Play Test Animation'
						onClick={this.play}
					/>
					<Button
						text='Poca Demo'
						onClick={this.pocademo}
					/>
					<p>copyright and trademark stuff</p>
				</div>
				{
					actors &&
					<Stage class={style.stage}>
						{actors}
					</Stage>
				}
			</div>
		)
	}
}