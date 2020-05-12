import { h, Component } from 'preact'
import style from './blackscreen.css'
import dispatch from 'util/data/dispatch'
import updater from 'util/game/updater'

export default class BlackScreen extends Component {
	constructor(props) {
		super(props)
		this.on = [
			dispatch.on('fadeInBS', this._fadeIn, this),
			dispatch.on('fadeOutBS', this._fadeOut, this)
		]
		this.opacity = 1
		this.state = {
			opacity: this.opacity
		}
		this.callback = null
	}

	_update(dt) {
		if (this.fade === 'in') {
			this.opacity += 0.032
			if (this.opacity > 1) {
				this.opacity = 1
				this.fade = null
				this.unreg()
				if (this.callback) this.callback()
			}
		}
		if (this.fade === 'out') {
			this.opacity -= 0.032
			if (this.opacity < 0) {
				this.opacity = 0
				this.fade = null
				this.unreg()
				if (this.callback) this.callback()
			}
		}
		this.setState({
			opacity: this.opacity
		})
	}

	_fadeIn(callback = null) {
		this.reg()
		this.callback = callback
		this.fade = 'in'
	}

	_fadeOut(callback = null) {
		this.reg()
		this.callback = callback
		this.fade = 'out'
	}

	reg = () => {
		updater.register('blackscreenUpdate', this._update, this)
	}

	unreg = () => {
		updater.unregister('blackscreenUpdate')
	}

	render({}, { opacity }) {
		let display = 'block'
		if (opacity === 0) {
			display = 'none'
		}
		return (
			<div class={style.blackscreen} style={{opacity, display}}></div>
		)
	}
}
