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
		bindAll(this, ['updateStageFromAnimation', '_setState', 'resize'])
		animator.setStageCallback(this.updateStageFromAnimation)
		window.addEventListener('resize', this.resize)
	}

	resize() {
		let { offsetHeight, offsetWidth } = this.stage
		this.setState({
			offsetHeight,
			offsetWidth
		})
	}

	updateStageFromAnimation(svg) {
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
		this.resize()
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
										return Object.values(v.grads).map(grad => {
											let { color1, color2, color1Offset, color2Offset, ...rest } = grad
											let colors = [
												{ color: color1, offset: color1Offset },
												{ color: color2, offset: color2Offset }
											]
											return (
												<linearGradient {...rest}>
													{
														colors.map(c => (
															<stop
																offset={c.offset}
																stop-color={c.color}
															/>
														))
													}
												</linearGradient>
											)
										})
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
