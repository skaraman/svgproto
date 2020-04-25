import { h, Component } from 'preact'
import style from './devui.css'
import classnames from 'classnames'
import { bindAll } from 'util/data/helpers'
import Button from 'components/ui/button'
import FpsMeter from 'components/devui/fps'
import FpsOptions from 'components/devui/fpsOptions'
import cache from 'util/data/cache'

class DevUI extends Component {
	constructor() {
		super()
		bindAll(this, ['toggleView'])
		this.open = false
	}

	toggleView() {
		if (this.open) {
			this.setState({
				animation: style.close
			})
		}
		else {
			this.setState({
				animation: style.open
			})
		}
	}

	navHome() {

	}

	navMainMenu() {

	}

	navDemoScene() {

	}

	render({}, { currentPage, animation }) {
		return (
			<ts-header-wrap class={classnames(style.header, animation)}>
				<Button
					class={style.closeButton}
					onClick={this.toggleView}
				/>
				<ts-header>SVG&nbsp;Proto</ts-header>
				<FpsMeter />
				<FpsOptions />
				<ts-nav>
					<Button
						class={currentPage === '/' && style.active}
						text={'Loading'}
						onClick={this.navHome}
					/>
					<Button
						class={currentPage === '/demoscene' && style.active}
						text={'Demo Scene'}
						onClick={this.navDemoScene}
					/>
					<Button
						class={currentPage === '/mainmenu' && style.active}
						text={'MainMenu'}
						onClick={this.navMainMenu}
					/>
				</ts-nav>
				<Button
					class={style.openButton}
					onClick={this.toggleView}
				/>
			</ts-header-wrap>
		)
	}
}

export default DevUI
