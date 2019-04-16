import { h } from 'preact'
import style from './style'

import FpsMeter from 'components/devui/fps'
import Options from 'components/devui/options'

const DevUI = () => (
    <header class={style.header}>
        <h1>SVG Proto</h1>
        <FpsMeter />
        <Options />
    </header>
)

export default DevUI