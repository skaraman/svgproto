import { h, Component, Fragment } from 'preact'
import { Router } from 'preact-router'
import DevUI from 'components/devui/devui'
import Terminal from 'components/devui/terminal'
import BlackScreen from 'components/game/blackscreen'
import DnD from 'components/game/donotdestroy'
import MainMenu from 'scenes/mainmenu/mainmenu'
import Demo from 'scenes/demo/demo'
import Loading from 'scenes/loading/loading'
import Settings from 'scenes/settings/settings'
import PocaDemo from 'scenes/pocademo/pocademo'
import cache from 'util/data/cache'
import dispatch from 'util/data/dispatch'
import { refreshStorageCheck, queryParams } from 'util/data/helpers'

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
		let isDev = queryParams()['dev']
		this.state = {
			isDev
		}
		cache.META_DATA.isDev = isDev
		cache.META_DATA.manifest = 'mainMenu'
		cache.META_DATA.exitRoute = RELOAD_URLS['/mainmenu']
		this.on = [
			dispatch.on('fsSuccess', this._handleFSSuccess, this)
		]
		document.body.className = ''
	}

	_handleFSSuccess() {
		if (cache.META_DATA.isReload) {
			this.handleRoute()
		}
	}

	handleRoute = event => {
		let bypass = false
		if (this.delayedRoute) {
			event = this.delayedRoute
			delete this.delayedRoute
			bypass = true
		}
		let url = event.url
		let indexOfTest = event.url.indexOf('?')
		if (indexOfTest >= 0) {
			url = url.substr(0, indexOfTest)
		}
		if (RELOAD_URLS[url] && event.previous === undefined) {
			cache.META_DATA.isReload = true
			if (!bypass) {
				this.delayedRoute = event
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
		this.currentUrl = url
	}

	render(props, { isDev, ready }) {
		return (
			<ts-app id='app' >
				{
					isDev && <DevUI currentPage={ this.currentUrl } />
				}
				<BlackScreen />
				<Router onChange={ this.handleRoute } >
					<Loading path={ ENTRY_URL['/'] } />
					<MainMenu ready={ ready } path={ RELOAD_URLS['/mainmenu'] } />
					<Settings ready={ ready } path={ RELOAD_URLS['/settings'] } />
					<Demo ready={ ready } path={ RELOAD_URLS['/demo'] } />
					<PocaDemo ready={ ready } path={ RELOAD_URLS['/pocademo'] } />
				</Router>
				<DnD />
				{
					isDev && <Terminal />
				}
			</ts-app>
		)
	}
}
