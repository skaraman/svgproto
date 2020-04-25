import { h, Component } from 'preact'
import style from './stage.css'
import classnames from 'classnames'
import { bindAll } from 'util/data/helpers'
import animator from 'util/game/animator'
import hierarchy from 'util/game/hierarchy'
import SvgWrap from 'components/ui/svgwrap'
import cache from 'util/data/cache'

import grid from 'img/grid.png'

export default class Stage extends Component {
	constructor(props) {
		super(props)
		bindAll(this, ['updateStageFromAnimation', 'updateStage', 'resize'])
		animator.setStageCallback(this.updateStageFromAnimation)
		window.addEventListener('resize', this.resize)
	}

	componentDidMount() {
		let isDev = cache.META_DATA.isDev
		if (isDev) {
			this.setDev()
		}
		hierarchy.add(this.props.children)
		this.updateStage()
		this.resize()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.children === prevProps.children) {
			return
		}
		hierarchy.update(this.props.children)
		this.updateStage()
	}

	setDev() {
		this.setState({
			isDev: true
		})
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

	updateStage() {
		let ents = hierarchy.getEntities()
		let grads = hierarchy.getGradients()
		this.setState({
			ents,
			grads
		})
	}

	render({ class: additionalClass }, { ents, grads, offsetWidth, offsetHeight, isDev }) {
		return (
			<div
				class={classnames(style.stage, additionalClass)}
				ref={elem => this.stage = elem}
				style={isDev ? `background-image: url(${grid});background-position: center;background-size: 10%;`: ''}
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
												{ color: color1, offset: 0 },
												{ color: color2, offset: 1 }
											]
											return (
												<linearGradient {...rest} >
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
						{ ents.map(ent => {
							if (Object.keys(ent.paths).length > 0) {
								return (
									<SvgWrap
										id={ent.id}
										stageHeight={offsetHeight}
										stageWidth={offsetWidth}
										height={ent.height}
										width={ent.width}
										{...ent.transform}
									>
										{ Object.keys(ent.paths).map(k => (<path {...ent.paths[k]} />)) }
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
