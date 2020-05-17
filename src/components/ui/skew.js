import { h, Component } from 'preact'
import style from './skew.css'

export default class Skew extends Component {

	render({
		animation,
		children
	}) {
		return (
			<ts-skew-wrap>
				<ts-skew-inner
					class={ animation }
				>
					{ children }
				</ts-skew-inner>
			</ts-skew-wrap>
		)
	}
}