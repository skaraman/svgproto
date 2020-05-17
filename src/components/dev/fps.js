import { h, Component, Fragment } from 'preact'
import style from './fps.css'
import { bindAll } from 'util/data/helpers'
import Button from 'components/ui/button'
import Checkbox from 'components/ui/checkbox'
import {
	componentDidMount,
	componentWillUnmount,
	initOptions,
	update,
	updateDisplayFPS,
	step,
	pauseToggle
} from './fpsScripts'

const Fps = () => (
	<Fragment>
		<FpsMeter />
		<FpsOptions />
	</Fragment>
)
export default Fps

export class FpsMeter extends Component {
	constructor() {
		super()
		bindAll(this, [
			componentDidMount,
			componentWillUnmount,
			update,
			updateDisplayFPS
		])
	}

	render({}, { displayFPS }) {
		return (
			<ts-fps>
				FPS:&nbsp;{ displayFPS }
			</ts-fps>
		)
	}
}


export class FpsOptions extends Component {
	constructor() {
		super()
		bindAll(this, [
			initOptions,
			pauseToggle,
			step
		])
	}

	componentDidMount() {
		this.initOptions()
	}

	render({}, { paused }) {
		return (
			<ts-fpsoptions>
				<Checkbox
					checked={ paused }
					onMouseUp={ this.pauseToggle }
				/>&nbsp;Pause
				<Button
					text={ 'step' }
					onMouseUp={ this.step }
				/>
			</ts-fpsoptions>
		)
	}
}
