import { h, Component, Fragment } from 'preact'
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
import cache from 'util/data/cache'
import dispatch from 'util/data/dispatch'
import { bindAll, refreshStorageCheck } from 'util/data/helpers'

const isDev = true
const ENTRY_URL = {
		'/': '/'
}
const RELOAD_URLS = {
	'/loading': '/loading',
	'/mainmenu': '/mainmenu',
	'/settings': '/settings',
	'/demo': '/demo',
	'/pocademo': '/pocademo'
}

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isDev
		}
		cache.META_DATA.isDev = isDev
		cache.META_DATA.manifest = 'mainMenuScene'
		cache.META_DATA.exitRoute = RELOAD_URLS['/mainmenu']
		this.on = [
			dispatch.on('fsSuccess', this.handleFSSuccess, this)
		]
	}

	handleFSSuccess() {
		if (cache.META_DATA.isReload) {
			this.handleRoute()
		}
	}

	handleRoute = e => {
		let bypass = false
		if (this.delayedRoute) {
			e = this.delayedRoute
			delete this.delayedRoute
			bypass = true
		}
		if (RELOAD_URLS[e.url] && e.previous === undefined) {
			cache.META_DATA.isReload = true
			if (!bypass) {
				this.delayedRoute = e
				return
			}
			else {
				this.setState({
					ready: true
				})
			}
		}
		else {
			cache.META_DATA.isReload = false
			this.setState({
				ready: true
			})
		}
		this.currentUrl = e.url
	}

	_deferDebug() {
		this.setState((prevState) => ({
			isDev
		}))
	}

	render({}, { isDev, ready }) {
		return (
			<div id='app'>
				{
					isDev && <DevUI />
				}
				<BlackScreen />
				<Router onChange={this.handleRoute} >
					<Loading path={ENTRY_URL['/']} />
					<Demo ready={ready} path={RELOAD_URLS['/demo']} />
					<MainMenu ready={ready} path={RELOAD_URLS['/mainmenu']} />
					<Settings ready={ready} path={RELOAD_URLS['/settings']} />
					<PocaDemo ready={ready} path={RELOAD_URLS['/pocademo']} />
				</Router>
				<DnD />
				{
					isDev && <Terminal />
				}
			</div>
		)
	}
}
