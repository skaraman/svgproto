import { h } from 'preact'
import style from './checkbox.css'
import CircleCheck from 'icons/circle-check.svg'
import Icon from 'components/ui/icon'

const Checkbox = ({
	checked,
	onMouseUp = event => event.stopPropagation(),
	onMouseDown = event => event.stopPropagation(),
	class: aClass
}) => (
	<ts-checkbox
		class={ aClass }
		onMouseUp={ onMouseUp }
		onMouseDown={ onMouseDown }
	>
		<Icon
			class={ checked && style.checked }
		>
			<CircleCheck />
		</Icon>
	</ts-checkbox>
)

export default Checkbox
