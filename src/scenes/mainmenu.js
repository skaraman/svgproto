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

export default class MainMenu extends Component {
	constructor(props) {
		super(props)
		bindAll(this, ['exit', 'play', 'testscene', 'pocademo', 'settings', 'initilizeScene'])
		input.register('keydown', 'mainMenuKeydown', this._keydown, this)
		updater.register('mainMenuUpdate', this._update, this)
		this.deltaTime = 0
		this.data = mainMenuScene
	}

	componentDidMount() {
		if (this.props.ready === true) {
			this.initilizeScene()
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.ready !== prevProps.ready && this.props.ready === true) {
			this.initilizeScene()
		}
	}

	reinitilizeScene() {
		this.reloadNotice.off()
		delete this.reloadNotice
		this.initilizeScene()
	}

	initilizeScene() {
		// TODO - figure out how to unbottleneck here
		let statics = cache.getStatics()
		if (!statics) {
			this.reloadNotice = dispatch.on('reading complete', this.reinitilizeScene, this)
			return
		}
		// initilize scene
		let entitiesList = [{
			id: 'colorChar',
			x: -150
		}]
		let entities = {}
		for (let act of entitiesList) {
			let { id = act, x, y } = act
			let entity = statics[id]
			entities[id] = {
				id,
				entity,
				// setup position in the scene, x and y should be relevant to center of screen
				transform: {
					x: x || 0,
					y: y || 0,
					rotate: 0,
					scale: 1
				}
			}
		}
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
			type: 'normal'
		})
		// this.playMotions = true
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
