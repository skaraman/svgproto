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
		let groups = hierarchy.getGroups()
		let grads = hierarchy.getGrads()
		this.setState({
			groups,
			grads
		})
	}

	componentWillMount() {
		debugger
		hierarchy.add(this.props.children)
	}

	componentWillReceiveProps(props, context) {
		hierarchy.update(props.children)
		this._setState()
	}

	render({ class: additionalClass }, { groups, grads }) {
		return (
			<div class={classnames(style.stage, additionalClass)}>
				<svg class={style.svgStage} style={{transform: 'scaleY(-1)'}} viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
					{
						grads.map((v) => {
							return (
								<linearGradient
									gradientUnits={v.props.gradientUnits}
									id={v.props.id + '_' + v.entity}
									x1={v.props.x1}
									x2={v.props.x2}
									y1={v.props.y1}
									y2={v.props.y2}
								>
									<stop
										offset={v.props.children[0].props.offset}
										stop-color={v.props.children[0].props['stop-color']}
									/>
									<stop
										offset={v.props.children[1].props.offset}
										stop-color={v.props.children[1].props['stop-color']}
									/>
								</linearGradient>
							)
						})
					}
					{
						groups.map((v) => {
							debugger
							return (
								<g id={v.props.id} class={style.translate} style={{transform: translate}}>
									<g class={style.scale} style={{transform: scale}}>
										<g class={style.rotate} style={{transform: rotate}}>
											<path
												d={v.props.d}
												fill={v.props.fill}

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