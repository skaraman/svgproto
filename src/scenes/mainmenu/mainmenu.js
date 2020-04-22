import { h, Component } from 'preact'
import style from './mainmenu.css'
import { route } from 'preact-router'
import animator from 'util/game/animator'
import cache from 'util/data/cache'
import input from 'util/game/input'
import dispatch from 'util/data/dispatch'
import updater from 'util/game/updater'
import { bindAll } from 'util/data/helpers'
import Button from 'components/ui/button'
import Stage from 'components/game/stage'
import mainMenuScene from 'data/scenes/mainmenu'
import physics from 'util/game/physics'
import { initilize } from './scripts'

export default class MainMenu extends Component {
	constructor(props) {
		super(props)
		bindAll(this, ['exit', 'play', 'testscene', 'pocademo', 'settings', 'initilizeScene', 'getStatics'])
		input.register('keydown', 'mainMenuKeydown', this._keydown, this)
		updater.register('mainMenuUpdate', this._update, this)
		this.deltaTime = 0
		this.data = mainMenuScene
		this.getStatics()
	}

	componentDidMount() {
		if (this.props.ready) {
			this.initilizeScene()
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.ready && this.props.ready !== prevProps.ready) {
			this.initilizeScene()
		}
	}

	getStatics(reload) {
		this.statics = cache.getStatics()
		// only for reload
		if (!this.statics) {
			this.reloadNotice = dispatch.on('reading complete', this.getStatics, this)
			return
		}
		else if (this.reloadNotice) {
			this.reloadNotice.off()
			delete this.reloadNotice
			this.initilizeScene()
		}
		// - only for reload
	}

	initilizeScene() {
		// only for reload
		if (!this.statics) {
			this.getStatics(true)
			return
		}
		// - only for reload
		let entities = initilize(this.statics)
		this.setState({
			entities
		})
		dispatch.send('fadeOutBS')
	}

	_update(dt) {
		if (this.playMotions) {
			debugger
			this.data
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

	_keydown(event) {
		console.log('mainMenuKeydown', event)
	}

	settings() {
		this.exit()
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

	play(event) {
		event.stopPropagation()
		animator.play({
			entityId: 'colorChar',
			name: 'powerUp',
			type: 'repeat'
		})
		// this.playMotions = true
	}

	stop(event) {
		event.stopPropagation()
		animator.kill('colorChar', 'powerUp')
	}

	exit() {
		updater.unregister('mainMenuUpdate')
		input.unregister('keydown', 'mainMenuKeydown')
		animator.kill('testAnimation')
	}

	render({ ready }, { entities }) {
		return (ready && entities &&
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
				{ entities &&
					<Stage class={style.stage}>
						{entities}
					</Stage>
				}
			</div>
		)
	}
}
