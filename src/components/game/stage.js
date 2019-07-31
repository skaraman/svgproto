import { h, Component } from 'preact'
import style from './stage.css'
import classnames from 'classnames'
import { bindAll } from 'util/helpers'

import animator from 'util/animator'
import hierarchy from 'util/hierarchy'
import SvgWrap from 'components/ui/svgwrap'

export default class Stage extends Component {
	constructor(props) {
		super(props)
		this.initialRender = false
		this.entities = {}
		bindAll(this, ['_setAnimationState'])
		animator.setStateCallback(this._setAnimationState)
	}

	_setAnimationState(svg) {
		let stateSvg = this.state[svg.id]
		this.setState({
			[svg.id]: {
				...stateSvg,
				svg
			}
		})
	}

	_setState() {
		let paths = hierarchy.getPaths()
		let grads = hierarchy.getGradients()
		this.entities = hierarchy.getEntities()
		this.setState({
			paths,
			grads
		})
	}

	componentWillReceiveProps(props, context) {
		let svgs = props.children[0]
		hierarchy.update(svgs)
		this._setState()
	}

	render({ children, class: additionalClass }, { paths, grads }) {
		if (this.initialRender === false) {
			hierarchy.clear()
			hierarchy.add(children[0])
			this._setState()
			this.initialRender = true
			return
		}
		return (
			<div class={classnames(style.stage, additionalClass)}>
				<svg class={style.svgStage} style={{transform: 'scaleY(-1)'}} viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
					{
						grads.map((v) => {
							return (
								<linearGradient
									gradientUnits={v.attributes.gradientUnits}
									id={v.attributes.id + '_' + v.entity}
									x1={v.attributes.x1}
									x2={v.attributes.x2}
									y1={v.attributes.y1}
									y2={v.attributes.y2}
								>
									<stop
										offset={v.children[0].attributes.offset}
										stop-color={v.children[0].attributes['stop-color']}
									/>
									<stop
										offset={v.children[1].attributes.offset}
										stop-color={v.children[1].attributes['stop-color']}
									/>
								</linearGradient>
							)
						})
					}
					{
						paths.map((v) => {
							let data = this.entities[v.entity]
							let translate = `translate(${data.x}, ${data.y})`
							let scale = `scale(${data.scale})`
							let rotate = `rotate(${data.rotation})`
							return (
								<g id={v.attributes.id} class={style.translate} style={{transform: translate}}>
									<g class={style.scale} style={{transform: scale}}>
										<g class={style.rotate} style={{transform: rotate}}>
											<path
												d={v.attributes.d}
												fill={v.attributes.fill}

											/>
										</g>
									</g>
								</g>
							)
						})
					}
				</svg>
			</div>
		)
	}
}