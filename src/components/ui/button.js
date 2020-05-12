import { h } from 'preact'
import style from './button.css'

const Button = ({
	text,
	onMouseDown,
	onMouseUp,
	class: aClass
}) => (
	<ts-button
		class={aClass}
		onMouseDown={onMouseDown}
		onMouseUp={onMouseUp}
	>
		{
			text
		}
	</ts-button>
)

export default Button
