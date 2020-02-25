import { h, Component } from 'preact'
import style from './svgwrap.css'
import { isDefined } from 'util/helpers'

export default class SVGWrap extends Component {

	render({
		children,
		x,
		y,
		rotate,
		scale,
		origin = [0, 0],
		anchor = [0, 0],
		stageHeight,
		stageWidth,
		width,
		height
	}) {
		let transform = ''
		let rotation = ''
		let translateX = ''
		let translateY = ''
		let scalar = ''
		if (isDefined(rotate)) {
			rotation = `rotate(${rotate}deg)`
		}
		if (isDefined(x)) {
			let [xOrigin] = origin
			let [xAnchor] = anchor
			let realX = ((stageWidth / 2) +
					((stageWidth / 2) * xOrigin)) -
				((width / 2) - ((width / 2) * xAnchor))
			translateX = `translateX(${realX}px)`
		}
		if (isDefined(y)) {
			let [, yOrigin] = origin
			let [, yAnchor] = anchor
			let realY = ((stageHeight / 2) +
					((stageHeight / 2) * yOrigin)) -
				((height / 2) - ((height / 2) * yAnchor))
			translateY = `translateY(${realY}px)`
		}
		if (isDefined(scale)) {
			scalar = `scale(${scale})`
		}
		transform = `${rotation} ${translateX} ${translateY} ${scalar}`
		return (
			<g class={style.svgwrap} style={{transform: transform}}>
				{children}
			</g>
		)
	}
}
