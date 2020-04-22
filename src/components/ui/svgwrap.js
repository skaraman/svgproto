import { h, Component } from 'preact'
import style from './svgwrap.css'
import { isDefined } from 'util/data/helpers'

export default class SVGWrap extends Component {

	render({
		children,
		x: ecks = 0,
		y: why = 0,
		rotate = 0,
		scale = 1,
		anchor = [0, 0],
		stageHeight,
		stageWidth,
		width,
		height
	}, { align = true }) {
		let transform = '', rotation = '', translateEcks = '', translateWhy = '', scalar = ''
		if (isDefined(rotate)) {
			rotation = `rotate(${rotate}deg)`
		}
		if (isDefined(why)) {
			let [, whyAnchor] = anchor
			let realWhy = (why + ((height / 2) * scale * whyAnchor))
			translateWhy = `translateY(${realWhy}px)`
		}
		if (isDefined(ecks)) {
			let [ecksAnchor] = anchor
			let realEcks = (ecks + ((width / 2) * scale * ecksAnchor))
			translateEcks = `translateX(${realEcks}px)`
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
						style={{transform: `${translateEcks} ${translateWhy}`}}
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
