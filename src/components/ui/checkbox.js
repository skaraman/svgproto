import { h, Component } from 'preact'
import style from './checkbox.css'
import circleCheck from 'icons/circle-check.svg'

const Checkbox = ({
	checked = false,
	onClick = () => console.log('onClick'),
	class: additionalClass
}) => (
	<ts-checkbox class={additionalClass} onClick={onClick} >
		<img src={circleCheck} class={checked && style.checked} />
	</ts-checkbox>
)

export default Checkbox
