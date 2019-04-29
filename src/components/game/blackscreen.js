import { h, Component } from 'preact'
import style from './blackscreen.css'

import dispatch from 'util/dispatch'
import updater from 'util/updater'

export default class BlackScreen extends Component {
    constructor(props) {
        super(props)
        this.on = [
            dispatch.on('fadeInBS', this.fadeIn, this),
            dispatch.on('fadeOutBS', this.fadeOut, this)
        ]
        this.opacity = 1
        this.setState({
            opacity: this.opacity
        })
        this.callback = null
    }

    _reg() {
        updater.register('blackscreenUpdate', this.update, this)
    }

    _unreg() {
        updater.unregister('blackscreenUpdate')
    }

    fadeIn(callback = null) {
        this._reg()
        this.callback = callback
        this.fade = 'in'
    }

    fadeOut(callback = null) {
        this._reg()
        this.callback = callback
        this.fade = 'out'
    }

    update(dt) {
        if (this.fade === 'in') {
            this.opacity += 0.032
            if (this.opacity > 1) {
                this.opacity = 1
                this.fade = null
                this._unreg()
                if (this.callback) this.callback()
            }
        }
        if (this.fade === 'out') {
            this.opacity -= 0.032
            if (this.opacity < 0) {
                this.opacity = 0
                this.fade = null
                this._unreg()
                if (this.callback) this.callback()
            }
        }
        this.setState({
            opacity: this.opacity
        })
    }

    render({}, { opacity }) {
        let display = 'block'
        if (opacity === 0) {
            display = 'none'
        }
        return (
            <div class={style.blackscreen} style={{opacity, display}}>
            </div>
        )
    }
}