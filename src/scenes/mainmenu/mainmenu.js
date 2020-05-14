import { h, Component } from 'preact'
import style from './mainmenu.css'
import Button from 'components/ui/button'
import Stage from 'components/game/stage'
import Mute from 'icons/mute.svg'
import Unmute from 'icons/unmute.svg'
import { bindAll } from 'util/data/helpers'
import dev from 'components/hoc/dev'
import draggable from 'components/hoc/draggable'
import {
	init,
	getStatics,
	initilizeScene,
	toggleMute,
	playAnimation,
	stopAnimation,
	playLoadingSound,
	update,
	keydown,
	settings,
	demo,
	pocademo,
	exit
} from './mainmenuScripts'

@dev
export default class MainMenu extends Component {
	constructor(props) {
		super(props)
		bindAll(this, [
			init,
			getStatics,
			initilizeScene,
			toggleMute,
			playLoadingSound,
			update,
			keydown,
			settings,
			demo,
			pocademo,
			exit
		])
	}

	componentDidMount() {
		if (this.props.ready) {
			this.init()
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.ready && this.props.ready !== prevProps.ready) {
			this.initilizeScene()
		}
	}

	render({
		ready
	}, {
		entities,
		isDev,
		isMute
	}) {
		return (ready && entities &&
			<ts-mainmenu-wrap class={ style.mainWrap } >
				<ts-mainmenu class={ style.mainMenu } >
					<ts-mainmenu-header class={ style.mainMenuText } >
						Main Menu
					</ts-mainmenu-header>
					<Button
						text={ 'Settings' }
						onMouseUp={ this.settings }
					/>
					<Button
						text={ 'Demo' }
						onMouseUp={ this.demo }
					/>
					<Button
						text={ 'Poca Demo' }
						onMouseUp={ this.pocademo }
					/>
				</ts-mainmenu>
				<Button
					Image={ isMute ? Unmute : Mute }
					onMouseUp={ this.toggleMute }
				/>
				<ts-mainmenu-copyright>
					copyright and trademark stuff
				</ts-mainmenu-copyright>
				{ entities &&
					<Stage class={ style.stage } >
						{ entities }
					</Stage>
				}
				{ isDev &&
					<MainMenuDevUI />
				}
			</ts-mainmenu-wrap>
		)
	}
}

@draggable
class MainMenuDevUI extends Component {
	constructor() {
		super()
		bindAll(this, [
			playAnimation,
			stopAnimation
		])
	}
	render({}, {
		dragBound,
		xPos,
		yPos
	}) {
		return ( dragBound &&
			<ts-mainmenu-devui
				onMouseDown={ this.drag }
				onMouseUp={ this.dragStop }
				style={ `transform: translate(${ xPos }px, ${ yPos }px` }

			>
				<Button
					text={ 'Play Test Animation' }
					onMouseUp={ this.playAnimation }
				/>
				<Button
					text={ 'Stop Test Animation' }
					onMouseUp={ this.stopAnimation }
				/>
			</ts-mainmenu-devui>
		)
	}
}
