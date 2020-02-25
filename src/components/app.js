import { h, Component } from 'preact'
import { Router } from 'preact-router'
import DevUI from 'components/devui/devui'
import Terminal from 'components/devui/terminal'
import BlackScreen from 'components/game/blackscreen'
import DnD from 'components/game/donotdestroy'
import MainMenu from 'scenes/mainmenu'
import Demo from 'scenes/demo'
import Loading from 'scenes/loading'
import Settings from 'scenes/settings'
import PocaDemo from 'scenes/pocademo'
import cache from 'util/cache'
import { bindAll } from 'util/helpers'
import updater from 'util/updater'

const isDev = true

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isDev,
			randomNumber: cache.randomNumber
		}
		cache.META_DATA.manifest = 'mainMenuScene'
		cache.META_DATA.exitRoute = '/mainmenu'
	}

	handleRoute = e => {
		this.currentUrl = e.url
	}

	_deferDebug() {
		this.setState((prevState) => ({
			isDev
		}))
	}

	render({}, { isDev, randomNumber }) {
		return (
			<div id='app'>
				{
					isDev && <DevUI />
				}
				<BlackScreen />
				<Router onChange={this.handleRoute} >
					<Loading path='/' />
					<Demo path='/demo' />
					<MainMenu path='/mainmenu' />
					<Settings path='/settings' />
					<PocaDemo path='/pocademo' />
				</Router>
				<DnD />
				{
					isDev && <Terminal />
				}
			</div>
		)
	}
}
