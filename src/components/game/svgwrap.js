import { h } from 'preact'
import style from './svgwrap.css'

const SVGWrap = ({ children, width, x, y, rotation }) => {
    let translate = `translate(${x}px, ${y}px)`
    let rotate = `rotate(${rotation}deg)`
    return (
        <div class={style.svgwrap} style={{width, transform: translate}}>
            <div class={style.rotate} style={{transform: rotate}}>
                {children}
            </div>
        </div>
    )
}
export default SVGWrap