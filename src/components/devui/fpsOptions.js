import { h, Component } from 'preact'
import style from './fpsOptions.css'
import updater from 'util/game/updater'
import Button from 'components/ui/button'
import { bindAll } from 'util/data/helpers'

export default class FpsOptions extends Component {
	constructor(props) {
		super(props)
		this.playing = true
		bindAll(this, ['pause', 'step'])
	}

	pause() {
		this.playing = !this.playing
		updater.toggle(this.playing)
	}

	step() {
		updater.step()
	}

	render({}, {}) {
		return (
			<div class={style.options}>
				<input type="checkbox" id="pause" onClick={this.pause} /> Pause
				<Button text="step" onClick={this.step} />
			</div>
		)
	}
}
