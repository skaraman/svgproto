import { h } from 'preact'
import { Link } from 'preact-router/match'
import style from './style'

import FpsMeter from 'components/devui/fps'

const DevUI = () => (
    <header class={style.header}>
        <h1>SVG Proto</h1>
        <FpsMeter />
        <nav>
            <Link activeClassName={style.active} href="/">Home</Link>
            {/*
                <Link activeClassName={style.active} href="/profile">Me</Link>
                <Link activeClassName={style.active} href="/profile/john">John</Link>
            */}
        </nav>
    </header>
)

export default DevUI