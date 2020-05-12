import { h, Component } from 'preact'
import style from './mainmenu.css'
import { route } from 'preact-router'
import animator from 'util/game/animator'
import cache from 'util/data/cache'
import input from 'util/game/input'
import dispatch from 'util/data/dispatch'
import updater from 'util/game/updater'
import Button from 'components/ui/button'
import Stage from 'components/game/stage'
import mainMenu from 'data/scenes/mainmenu'
import physics from 'util/game/physics'
import { initilize } from './scripts'
import { bindAll } from 'util/data/helpers'
import dev from 'components/hoc/dev'

@dev
export default class MainMenu extends Component {
	constructor(props) {
		super(props)
		input.register('keydown', 'mainMenuKeydown', this._keydown, this)
		updater.register('mainMenuUpdate', this._update, this)
		this.deltaTime = 0
		this.data = mainMenu
		this.getStatics()
		bindAll(this, [initilize])
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

	getStatics = (reload) => {
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

	initilizeScene = () => {
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

	settings = () => {
		this.exit()
		route('/settings')
	}

	demo = () => {
		cache.META_DATA.exitRoute = '/demo'
		cache.META_DATA.manifest = 'demo'
		dispatch.send('fadeInBS', () => {
			this.exit()
			route('/')
		})
	}

	pocademo = () => {
		cache.META_DATA.exitRoute = '/pocademo'
		cache.META_DATA.manifest = 'pocaDemo'
		dispatch.send('fadeInBS', () => {
			this.exit()
			route('/')
		})
	}

	play = (event) => {
		event.stopPropagation()
		animator.play({
			entityId: 'colorChar',
			name: 'powerUp',
			type: 'repeat'
		})
		// this.playMotions = true
	}

	stop = (event) => {
		event.stopPropagation()
		animator.kill('colorChar', 'powerUp')
	}

	exit = () => {
		updater.unregister('mainMenuUpdate')
		input.unregister('keydown', 'mainMenuKeydown')
		animator.kill('testAnimation')
	}

	render({ ready }, { entities, isDev }) {
		return (ready && entities &&
			<div class={ style.mainWrap } >
				<div class={ style.mainMenu } >
					<div class={ style.mainMenuText } >
						Main Menu
					</div>
					<Button
						text='Settings'
						onClick={ this.settings }
					/>
					<Button
						text='Demo'
						onClick={ this.demo }
					/>
					<Button
						text='Poca Demo'
						onClick={ this.pocademo }
					/>
				</div>
				<ts-text>copyright and trademark stuff</ts-text>
				{ entities &&
					<Stage class={ style.stage } >
						{ entities }
					</Stage>
				}
				{ isDev &&
					<div class={ style.animationMenu } >
						<Button
							text='Play Test Animation'
							onClick={ this.play }
						/>
					</div>
				}
			</div>
		)
	}
}
