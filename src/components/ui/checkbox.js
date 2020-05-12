import { h, Component } from 'preact'
import style from './checkbox.css'
import circleCheck from 'icons/circle-check.svg'
import Icon from 'components/ui/icon'

const Checkbox = ({
	checked,
	onClick,
	class: aClass
}) => (
	<ts-checkbox
		class={aClass}
		onClick={onClick}
	>
		<Icon
			image={circleCheck}
			class={checked && style.checked}
		/>
	</ts-checkbox>
)

export default Checkbox
