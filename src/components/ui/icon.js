import { h, Component, createRef } from 'preact'
import style from './icon.css'

class Icon extends Component {
	ref = createRef()

	render({
		image,
		class: aClass
	}) {
		if (this.ref.current) {
			this.ref.current.style.setProperty('--ts-image', `url(${ image })`)
		}
		return (
			<ts-img
				ref={ this.ref }
				class={ aClass }
			/>
		)
	}
}

export default Icon
