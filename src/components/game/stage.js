import { h } from 'preact'
import style from './stage.css'

const Stage = ({ children }) => {
    return (
        <svg class={style.stage}>
            {children}
        </svg>
    )
}
export default Stage