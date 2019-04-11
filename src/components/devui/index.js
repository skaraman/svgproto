import { h } from 'preact'
import { Link } from 'preact-router/match'
import style from './style'

const DevUI = () => (
    <header class={style.header}>
        <h1>SVG Proto</h1>
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
