import { h } from 'preact'
import style from './style'

const Button = ({
  text = 'Button',
  onClick = () => console.log('onClick')
}) => (
  <div class={style.button} onClick={onClick}> {text} </div>
)

export default Button