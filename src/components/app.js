import { h, Component, Fragment } from 'preact'
import Router from 'components/util/router'
import DevUI from 'components/dev/ui'
import Terminal from 'components/dev/terminal'
import BlackScreen from 'components/game/blackscreen'
import DnD from 'components/game/donotdestroy'
import MainMenu from 'scenes/mainmenu'
import Demo from 'scenes/demo'
import Loading from 'scenes/loading'
import Settings from 'scenes/settings'
import PocaDemo from 'scenes/pocademo'
import cache from 'util/data/cache'
import dispatch from 'util/data/dispatch'
import { refreshStorageCheck, queryParams } from 'util/data/helpers'
import { Howl } from 'howler'
import style from './app.css'

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

let delayedRoute

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
		// const empty = new Howl({src: ['']})
		// empty.play()
		setTheme(cache.THEME._current)
	}

	_handleFSSuccess() {
		if (cache.META_DATA.isReload) {
			this.handleRoute()
		}
	}

	handleRoute = (event) => {
		let bypass = false
		if (delayedRoute) {
			event = delayedRoute
			delayedRoute = null
			bypass = true
		}
		let { previous, path, search = '' } = event
		if (RELOAD_URLS[path] && !previous) {
			cache.META_DATA.isReload = true
			if (!bypass) {
				delayedRoute = event
				return
			}
			else {
				this.setState({
					ready: true,
					currentPath: path + search
				})
			}
		}
		else {
			cache.META_DATA.isReload = false
			this.setState({
				ready: true,
				currentPath: path + search
			})
		}
	}


	render({}, {
		isDev,
		ready,
		currentPath
	}) {
		return (
			<ts-app id='app' >
				{
					isDev && <DevUI currentPath={ currentPath } />
				}
				<BlackScreen />
				<Router
					currentPath={ currentPath }
					onChange={ this.handleRoute }
				>
					<Loading path={ ENTRY_URL['/'] } />
					<MainMenu
						ready={ ready }
						path={ RELOAD_URLS['/mainmenu'] }
					/>
					<Settings
						ready={ ready }
						path={ RELOAD_URLS['/settings'] }
					/>
					<Demo
						ready={ ready }
						path={ RELOAD_URLS['/demo'] }
					/>
					<PocaDemo
						ready={ ready }
						path={ RELOAD_URLS['/pocademo'] }
					/>
				</Router>
				<DnD />
				{
					isDev && <Terminal />
				}
			</ts-app>
		)
	}
}

export function setTheme(theme) {
	document.body.className = style[theme]
}
