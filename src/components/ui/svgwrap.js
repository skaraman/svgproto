import { h, Component } from 'preact'
import style from './svgwrap.css'

export default class SVGWrap extends Component {

	componentDidMount() {
		debugger
	}

	render({ children, width, x, y, rotation, top, bottom, left, right, origin }) {
		let rotate = ''
		if (rotation)
			rotate = `rotate(${rotation}deg)`
		let svgStyle = {}
		if (x && y)
			svgStyle.translate = `translate(${x}, ${y})`
		if (width)
			svgStyle.width = width
		if (top)
			svgStyle.top = top
		if (bottom)
			svgStyle.bottom = bottom
		if (left)
			svgStyle.left = left
		if (right)
			svgStyle.right = right
		return (
			<div class={style.svgwrap} style={svgStyle}>
				<div class={style.rotate} style={{transform: rotate}}>
					{children}
				</div>
			</div>
		)
	}
}