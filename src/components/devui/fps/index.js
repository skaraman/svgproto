import { h, Component } from 'preact'
import style from './style'

import Updater from 'util/updater'

export default class FpsMeter extends Component {
    constructor(props) {
        super(props)
        Updater.register('fpsmeter', this.update, this)
        this.fps = 0
        this.updateTime = 0
    }

    update(dt) {
        this.fps++
        this.updateTime += dt
        if (this.updateTime >= 1000) this.setPerformanceState()
    }

    setPerformanceState() {
        this.setState({
            fps: this.fps
        })
        this.fps = 0
        this.updateTime = 0
    }

    componentDidMount() {
        this.setPerformanceState()
    }

    render({}, { fps }) {
        //console.log(fps)
        return (
            <div class={style.fps}>
                <p>Current Frames Per Second {fps}</p>
            </div>
        )
    }
}