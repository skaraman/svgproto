import { h, Component } from 'preact'
import style from './settings.css'
import input from 'util/game/input'
import { bindAll } from 'util/data/helpers'
import Button from 'components/ui/button'
import SVGWrap from 'components/ui/svgwrap'
import Mute from 'icons/mute.svg'
import Unmute from 'icons/unmute.svg'
import Slider from 'components/ui/slider.js'
import {
	initilize,
	save,
	cancel,
	volumeUpdate,
	toggleMute
} from './settingsScripts'

export default class Settings extends Component {
	constructor(props) {
		super(props)
		this.input = input
		this.input.register(
			'keydown',
			'settingsKeydown',
			this.keydown,
			this
		)
		bindAll(this, [
			initilize,
			save,
			cancel,
			volumeUpdate,
			toggleMute
		])
	}

	componentDidMount() {
		this.initilize()
	}

	keydown(event) {
		console.log('settingsKeydown', event)
	}

	render({}, {
		volumeLevel,
		isMute
	}) {
		return (
			<ts-settings-wrap>
				<ts-settings-inner>
					<ts-settings-header>
						Settings
					</ts-settings-header>
					<ts-settings-subheader>
						Audio
					</ts-settings-subheader>
					<Button
						Image={ isMute ? Unmute : Mute }
						onMouseUp={ this.toggleMute }
					/>
					<Slider
						label={ 'Volume' }
						startingPos={ volumeLevel || 0 }
						onUpdate={ this.volumeUpdate }
					/>
					<ts-settings-subheader>
						Keybindings
					</ts-settings-subheader>
					<Button
						text={ 'Save' }
						onMouseUp={ this.save }
					/>
					<Button
						text={ 'Cancel' }
						onMouseUp={ this.cancel }
					/>
					<p>copyright and trademark stuff</p>
				</ts-settings-inner>
			</ts-settings-wrap>
		)
	}
}
