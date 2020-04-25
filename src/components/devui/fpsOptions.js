import { h, Component } from 'preact'
import style from './fpsOptions.css'
import { bindAll } from 'util/data/helpers'
import updater from 'util/game/updater'
import Button from 'components/ui/button'
import Checkbox from 'components/ui/checkbox'

export default class FpsOptions extends Component {
	constructor(props) {
		super(props)
		bindAll(this, ['pause', 'step'])
	}

	pause() {
		let { paused } = this.state
		updater.toggle(!!paused)
		this.setState({
			paused: !paused
		})
	}

	step() {
		updater.step()
	}

	render({}, {
		paused
	}) {
		return (
			<ts-fpsoptions
				class={style.options}
			>
				<Checkbox
					checked={paused}
					onClick={this.pause}
				/>&nbsp;Pause
				<Button
					text='step'
					onClick={this.step}
				/>
			</ts-fpsoptions>
		)
	}
}
