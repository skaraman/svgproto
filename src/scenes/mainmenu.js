import { h, Component } from 'preact'
import style from './mainmenu.css'
import Button from 'components/ui/button'
import Stage from 'components/game/stage'
import WebglStage from 'components/game/webglstage'
import Mute from 'icons/mute.svg'
import Unmute from 'icons/unmute.svg'
import Skew from 'components/ui/skew'
import { bindAll } from 'util/data/helpers'
import dev from 'components/hoc/dev'
import draggable from 'components/hoc/draggable'
import {
	componentDidUpdate,
	componentWillUnmount,
	getStatics,
	init,
	initScene,
	toggleMute,
	playMusic,
	update,
	keydown,
	settings,
	demo,
	pocademo,
	playAnimation,
	stopAnimation
} from './mainmenuScripts'

const COPYRIGHT = 'copyright and trademark stuff'

@dev
export default class MainMenu extends Component {
	constructor(props) {
		super(props)
		bindAll(this, [
			componentDidUpdate,
			componentWillUnmount,
			getStatics,
			init,
			initScene,
			toggleMute,
			playMusic,
			update,
			keydown,
			settings,
			demo,
			pocademo
		])
	}

	componentDidMount() {
		this.init()
	}

	render({
		ready
	}, {
		entities,
		isDev,
		isMute
	}) {
		return (ready && entities &&
			<ts-mainmenu-wrap>
				{ entities &&
					<Stage class={ style.stage } >
						{ entities }
					</Stage>
				}
				<ts-mainmenu-inner>
					<Skew animation={ style.skewAnimation } >
						<ts-mainmenu-header>
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
						<Button
							Image={ isMute ? Unmute : Mute }
							onMouseUp={ this.toggleMute }
						/>
						<ts-mainmenu-copyright>
							{ COPYRIGHT }
						</ts-mainmenu-copyright>
					</Skew>
				</ts-mainmenu-inner>
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
		return (dragBound &&
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
