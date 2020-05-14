import { h } from 'preact'
import style from './button.css'
import Icon from 'components/ui/icon'

const Button = ({
	text,
	Image,
	onMouseDown = event => event.stopPropagation(),
	onMouseUp = event => event.stopPropagation(),
	class: aClass
}) => (
	<ts-button
		class={ aClass }
		onMouseDown={ onMouseDown }
		onMouseUp={ onMouseUp }
	>
		{ Image &&
			<Icon>
				<Image />
			</Icon>
		}
		{ text }
	</ts-button>
)

export default Button
