import { h } from 'preact'
import style from './button.css'

const Button = ({
	text,
	onClick = () => console.log('onClick'),
	class: additionalClass
}) => (
	<ts-button class={additionalClass} onClick={onClick}>
		{
			text
		}
	</ts-button>
)

export default Button
