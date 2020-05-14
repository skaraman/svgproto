import { h, Component, Fragment } from 'preact'
import style from './ui.css'
import classnames from 'classnames'
import Button from 'components/ui/button'
import Fps from 'components/dev/fps/fps'
import DropDown from 'components/ui/dropdown'
import { bindAll } from 'util/data/helpers'
import draggable from 'components/hoc/draggable'
import {
	toggleView,
	switchTheme
} from './uiScripts'

@draggable
export default class DevUI extends Component {
	constructor() {
		super()
		bindAll(this, [
			toggleView,
			switchTheme
		])
	}

	render({
		currentPage
	}, {
		dragBound,
		animation,
		xPos = 0,
		yPos = 0
	}) {
		return ( dragBound &&
			<ts-devui-wrap
				class={ animation }
				onMouseDown={ this.drag }
				onMouseUp={ this.dragStop }
				style={ `transform: translate(${ xPos }px, ${ yPos }px` }
			>
				<Button
					class={ style.closeButton }
					onMouseUp={ this.toggleView }
				/>
				<ts-devui-header>
					SVG&nbsp;Proto
				</ts-devui-header>
				<DevOptions />
				<DevScenes currentPage={ currentPage } />
				<Button
					class={ style.theme }
					text={ 'Theme' }
					onMouseUp={ this.switchTheme }
				/>
				<Button
					class={ style.openButton }
					onMouseUp={ this.toggleView }
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
				onMouseUp={ this._navHome }
			/>
			<Button
				class={ currentPage === '/demoscene' && style.active }
				text={ 'Demo' }
				onMouseUp={ this._navDemo }
			/>
			<Button
				class={ currentPage === '/mainmenu' && style.active }
				text={ 'MainMenu' }
				onMouseUp={ this._navMainMenu }
			/>
		</DropDown>
	)
}
