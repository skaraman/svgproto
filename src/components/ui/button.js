import { h } from 'preact'
import style from './button.css'

const Button = ({
	text = 'Button',
	onClick = () => console.log('onClick')
}) => (
	<ts-button class={style.button} onClick={onClick}>
		{
			text
		}
	</ts-button>
)

export default Button
