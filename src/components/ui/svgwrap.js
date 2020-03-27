import { h, Component } from 'preact'
import style from './svgwrap.css'
import { isDefined } from 'util/helpers'

export default class SVGWrap extends Component {
	constructor() {
		super()
		this.alignAttempted = false
	}

	// componentDidUpdate() {
	// 	if (!this.alignAttempted) {
	// 		this.alignAttempted = true
	// 		this.setState({
	// 			align: false
	// 		})
	// 		setTimeout(() => {
	// 			this.setState({
	// 				align: true
	// 			})
	// 		}, 5)
	// 		setTimeout(() => {
	// 			this.alignAttempted = false
	// 		}, 10)
	// 	}
	// }

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
	}, { align = true }) {
		let transform = ''
		let rotation = ''
		let translateX = ''
		let translateY = ''
		let scalar = ''
		if (isDefined(rotate)) {
			rotation = `rotate(${rotate}deg)`
		}
		if (isDefined(x)) {
			// let [xOrigin] = origin
			// let [xAnchor] = anchor
			// let realX = ((stageWidth / 2) +
			// 		((stageWidth / 2) * xOrigin)) -
			// 	((width / 2) - ((width / 2) * xAnchor))
			translateX = `translateX(${x}px)`
		}
		if (isDefined(y)) {
			// let [, yOrigin] = origin
			// let [, yAnchor] = anchor
			// let realY = ((stageHeight / 2) +
			// 		((stageHeight / 2) * yOrigin)) -
			// 	((height / 2) - ((height / 2) * yAnchor))
			translateY = `translateY(${y}px)`
		}
		if (isDefined(scale)) {
			scalar = `scale(${scale})`
		}
		return (
			<g
				class={align ? style.align : false}
				ref={elem => this.alignLayer = elem}
			>
				<svg
					x={-width/2}
					y={-height/2}
					width={width}
					height={height}
					class={style.svgWrap}
					viewBox={`0 0 ${width} ${height}`}
				>
					<g
						class={style.translateXY}
						style={{transform: `${translateX} ${translateY}`}}
					>
						<g
							class={style.scaleRotate}
							style={{transform: `${scalar} ${rotation}`}}
						>
							{children}
						</g>
					</g>
				</svg>
			</g>
		)
	}
}
