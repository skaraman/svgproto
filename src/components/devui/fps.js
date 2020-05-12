import { h, Component, Fragment } from 'preact'
import style from './fps.css'
import updater from 'util/game/updater'
import { intParse } from 'util/data/helpers'
import Button from 'components/ui/button'
import Checkbox from 'components/ui/checkbox'

const second = 1000
const limiter = 2

let isPaused = false

const Fps = () => (
	<Fragment>
		<FpsMeter />
		<FpsOptions />
	</Fragment>
)
export default Fps

export class FpsMeter extends Component {
	fps = 0
	calls = 0
	updateTime = 0

	componentDidMount() {
		updater.register('fpsmeter', this._update, this)
		this.setPerformanceState()
	}

	componentWillUnmount() {
		updater.unregister('fpsmeter')
	}

	_update(dt) {
		this.fps++
		this.updateTime += dt
		if (this.updateTime >= second * limiter) this.setPerformanceState()
	}

	setPerformanceState = () => {
		this.setState({
			fps: intParse(this.fps / limiter)
		})
		this.fps = 0
		this.updateTime = 0
	}

	render({}, { fps }) {
		return (
			<ts-fps class={ style.fps } >
				FPS:&nbsp;{ fps }
			</ts-fps>
		)
	}
}


export class FpsOptions extends Component {
	componentDidMount() {
		if (isPaused) {
			this.init()
		}
	}

	init = () => {
		this.setState({
			paused: isPaused
		})
		updater.toggle(!isPaused)
	}

	pause = (event) => {
		event.stopPropagation()
		let { paused } = this.state
		updater.toggle(!!paused)
		this.setState({
			paused: !paused
		})
		isPaused = !paused
	}

	step = () => {
		updater.step()
	}

	render({}, { paused }) {
		return (
			<ts-fpsoptions>
				<Checkbox
					checked={ paused }
					onClick={ this.pause }
				/>&nbsp;Pause
				<Button
					text={ 'step' }
					onClick={ this.step }
				/>
			</ts-fpsoptions>
		)
	}
}
