import { h, Component, createRef } from 'preact'
import style from './icon.css'

class Icon extends Component {

	render({
		class: aClass,
		children
	}) {
		return (
			<ts-img
				class={ aClass }
			>
				{ children }
			</ts-img>
		)
	}
}

export default Icon
