import { h, Component } from 'preact'
import style from './devui.css'
import { bindAll } from 'util/data/helpers'
import { Link } from 'preact-router/match';
import FpsMeter from 'components/devui/fps'
import FpsOptions from 'components/devui/fpsOptions'
import cache from 'util/data/cache'

class DevUI extends Component {

	render({}, {}) {
		return (
			<header class={style.header}>
				<h1>SVG Proto</h1>
				<nav>
					<Link activeClassName={style.active} href="/">Loading</Link>
					<Link activeClassName={style.active} href="/testscene">Test Scene</Link>
					<Link activeClassName={style.active} href="/mainmenu">MainMenu</Link>
				</nav>
				<FpsMeter />
				<FpsOptions />
			</header>
		)
	}
}

export default DevUI
