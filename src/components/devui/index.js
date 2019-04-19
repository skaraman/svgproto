import { h } from 'preact'
import style from './style'
import { Link } from 'preact-router/match';
import FpsMeter from 'components/devui/fps'
import Options from 'components/devui/options'

const DevUI = () => (
    <header class={style.header}>
        <h1>SVG Proto</h1>
        <nav>
            <Link activeClassName={style.active} href="/">Loading</Link>
            <Link activeClassName={style.active} href="/testscene">Test Scene</Link>
            <Link activeClassName={style.active} href="/mainmenu">MainMenu</Link>
        </nav>
        <FpsMeter />
        <Options />
    </header>
)

export default DevUI
