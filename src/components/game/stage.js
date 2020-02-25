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
		bindAll(this, ['_setAnimationState', '_setState', 'reportWindowSize'])
		animator.setStateCallback(this._setAnimationState)
		window.addEventListener('resize', this.reportWindowSize)
	}

	reportWindowSize() {
		let { offsetHeight, offsetWidth } = this.stage
		this.setState({
			offsetHeight,
			offsetWidth
		})
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
		let ents = hierarchy.getEntities()
		let grads = hierarchy.getGradients()
		this.setState({
			ents,
			grads
		})
	}

	componentDidMount() {
		hierarchy.add(this.props.children)
		this._setState()
		this.reportWindowSize()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.children === prevProps.children) {
			return
		}
		hierarchy.update(this.props.children)
		this._setState()
	}

	render({ class: additionalClass }, { ents, grads, offsetWidth, offsetHeight }) {
		return (
			<div
				class={classnames(style.stage, additionalClass)}
				ref={elem => this.stage = elem}
			>
				{ ents && grads &&
					<svg
						class={style.svgStage}
						viewBox={`0 0 ${offsetWidth} ${offsetHeight}`}
					>
						<defs>
							{ grads.map((v) => {
									if (v.grads) {
										for (let gradId in v.grads) {
											let {children, ...rest} = v.grads[gradId]
											return ( <linearGradient {...rest}>
												{ children.map(childStop => (
														<stop
															offset={childStop.props.offset}
															stop-color={childStop.props['stop-color']}
														/>
													))
												}
											</linearGradient>)
										}
									}
								})
							}
						</defs>
						{ ents.map(v => {
							if (Object.keys(v.paths).length > 0) {
								return (
									<SvgWrap
										id={v.id}
										stageHeight={offsetHeight}
										stageWidth={offsetWidth}
										height={v.height}
										width={v.width}
										{...v.transform}
									>
										{ Object.keys(v.paths).map(k => (<path {...v.paths[k]} />)) }
									</SvgWrap>
								)
							}
						})}
					</svg>
				}
			</div>
		)
	}
}
