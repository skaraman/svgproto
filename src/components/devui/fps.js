import { h, Component } from 'preact'
import style from './fps.css'
import updater from 'util/game/updater'
import { intParse, bindAll } from 'util/data/helpers'

const second = 1000
const limiter = 2

export default class FpsMeter extends Component {
	constructor(props) {
		super(props)
		updater.register('fpsmeter', this._update, this)
		bindAll(this, ['setPerformanceState'])
		this.fps = 0
		this.calls = 0
		this.updateTime = 0
	}

	componentDidMount() {
		this.setPerformanceState()
	}

	_update(dt) {
		this.fps++
		this.updateTime += dt
		if (this.updateTime >= second * limiter) this.setPerformanceState()
	}

	setPerformanceState() {
		this.setState({
			fps: intParse(this.fps / limiter),
			calls: intParse(this.calls / limiter)
		})
		this.fps = 0
		this.calls = 0
		this.updateTime = 0
	}

	render({}, { fps }) {
		return (
			<div class={style.fps}>
				<p>FPS: {fps}</p>{/*<p>Calls: </p>*/}
			</div>
		)
	}
}
