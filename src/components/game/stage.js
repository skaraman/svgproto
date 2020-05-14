import { h, Component } from 'preact'
import style from './stage.css'
import classnames from 'classnames'
import animator from 'util/game/animator'
import hierarchy from 'util/game/hierarchy'
import SvgWrap from 'components/ui/svgwrap'
import cache from 'util/data/cache'
import dev from 'components/hoc/dev'

@dev
export default class Stage extends Component {
	constructor(props) {
		super(props)
		animator.setStageCallback(this.updateStageFromAnimation)
		window.addEventListener('resize', this.resize)
	}

	componentDidMount() {
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

	resize = () => {
		let { offsetHeight, offsetWidth } = this.stage
		this.setState({
			offsetHeight,
			offsetWidth
		})
	}

	updateStageFromAnimation = (svg) => {
		let stateSvg = this.state[svg.id]
		this.setState({
			[svg.id]: {
				...stateSvg,
				svg
			}
		})
	}

	updateStage = () => {
		let ents = hierarchy.getEntities()
		let grads = hierarchy.getGradients()
		this.setState({
			ents,
			grads
		})
	}

	render({
		class: aClass
	}, {
		ents,
		grads,
		offsetWidth,
		offsetHeight,
		isDev
	}) {
		return (
			<div
				class={ classnames(
					style.stage,
					aClass,
					isDev && style.devGrid
				)}
				ref={ elem => this.stage = elem }
			>
				{ ents && grads &&
					<svg
						class={ style.svgStage }
						viewBox={ `0 0 ${ offsetWidth } ${ offsetHeight }` }
					>
						<defs>
							{ grads.map(item => {
								if (item.grads) {
									return Object.values(item.grads).map(grad => {
										let {
											color1,
											color2,
											color1Offset,
											color2Offset,
											...rest
										} = grad
										let colors = [
											{ color: color1, offset: 0 },
											{ color: color2, offset: 1 }
										]
										return (
											<linearGradient { ...rest } >
												{ colors.map(color => (
													<stop
														offset={ color.offset }
														stop-color={ color.color }
													/>
												))}
											</linearGradient>
										)
									})
								}
							})}
						</defs>
						{ ents.map(ent => {
							if (Object.keys(ent.paths).length > 0) {
								return (
									<SvgWrap
										id={ ent.id }
										stageHeight={ offsetHeight }
										stageWidth={ offsetWidth }
										height={ ent.height }
										width={ ent.width }
										{ ...ent.transform }
									>
										{ Object.keys(ent.paths).map(k => (
											<path { ...ent.paths[k] } />
										))}
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
