import { h, Component } from 'preact'
import style from './fps.css'

import updater from 'util/updater'

const second = 1000
const limiter = 2

export default class FpsMeter extends Component {
    constructor(props) {
        super(props)
        updater.register('fpsmeter', this.update, this)
        this.fps = 0
        this.calls = 0
        this.updateTime = 0
    }

    update(dt) {
        this.fps++
        this.updateTime += dt
        if (this.updateTime >= second * limiter) this.setPerformanceState()
    }

    setPerformanceState() {
        this.setState({
            fps: ~~(this.fps / limiter),
            calls: ~~(this.calls / limiter)
        })
        this.fps = 0
        this.calls = 0
        this.updateTime = 0
    }

    componentDidMount() {
        this.setPerformanceState()
    }

    render({}, { fps }) {
        //console.log(fps)
        return (
            <div class={style.fps}>
                <p>FPS: {fps}</p>{/*<p>Calls: </p>*/}
            </div>
        )
    }
}