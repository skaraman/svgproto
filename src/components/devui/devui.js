import { h, Component, Fragment } from 'preact'
import style from './devui.css'
import classnames from 'classnames'
import Button from 'components/ui/button'
import Fps from 'components/devui/fps'
import DropDown from 'components/ui/dropdown'
import cache from 'util/data/cache'
import input from 'util/game/input'
import { isNaZN } from 'util/data/helpers'

export default class DevUI extends Component {
	open = false
	initialMove = true
	startX = 0
	startY = 0

	_moveDevUi(event) {
		let { clientX, clientY } = event
		let { x = 0, y = 0 } = this.state
		if (this.initialMove) {
			this.startX = clientX - x
			this.startY = clientY - y
			this.initialMove = false
		}
		x = (clientX - this.startX)
		y = (clientY - this.startY)
		this.setState({
			x,
			y
		})
	}

	drag = (event) => {
		event.stopPropagation()
		input.register('mousemove', 'devUIMouseMove', this._moveDevUi, this)
	}

	dragStop = (event) => {
		event.stopPropagation()
		input.unregister('mousemove', 'devUIMouseMove')
		this.initialMove = true
	}

	toggleView = (event) => {
		event.stopPropagation()
		let {x, y} = this.state;
		if (isNaZN(x) || isNaZN(y)) {
			this.setState({
				x: 0,
				y: 0
			})
			return
		}
		if (this.open) {
			this.setState({
				animation: style.closeAnim
			})
			this.open = false
		}
		else {
			this.setState({
				animation: style.openAnim
			})
			this.open = true
		}
	}

	navHome = () => {}

	navMainMenu = () => {}

	navDemo = () => {}

	render({ currentPage }, { animation, x = 0, y = 0 }) {
		return (
			<ts-devui-wrap
				class={ animation }
				onMouseDown={this.drag}
				onMouseUp={this.dragStop}
				style={`transform: translate(${x}px, ${y}px`}
			>
				<Button
					class={ style.closeButton }
					onMouseUp={ this.toggleView }
					onMouseDown={ event => event.stopPropagation() }
				/>
				<ts-devui-header>SVG&nbsp;Proto</ts-devui-header>
				<DevOptions />
				<DevScenes currentPage={ currentPage } />
				<Button
					class={ style.openButton }
					onMouseUp={ this.toggleView }
					onMouseDown={ event => event.stopPropagation() }
				/>
			</ts-devui-wrap>
		)
	}
}

function DevOptions () {
	return (
		<DropDown
			class={ style.devOptions }
			label={ 'Options' }
		>
			<Fps />
		</DropDown>
	)
}

function DevScenes({ currentPage }) {
	return (
		<DropDown
			class={ style.devScenes }
			label={ 'Scenes' }
		>
			<Button
				class={ currentPage === '/' && style.active }
				text={ 'Loading' }
				onClick={ this.navHome }
			/>
			<Button
				class={ currentPage === '/demoscene' && style.active }
				text={ 'Demo' }
				onClick={ this.navDemo }
			/>
			<Button
				class={ currentPage === '/mainmenu' && style.active }
				text={ 'MainMenu' }
				onClick={ this.navMainMenu }
			/>
		</DropDown>
	)
}
