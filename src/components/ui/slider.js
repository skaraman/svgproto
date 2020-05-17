import { h, Component, createRef } from 'preact'
import style from './slider.css'
import classnames from 'classnames'
import { bindAll } from 'util/data/helpers'
import {
	componentDidMount,
	componentWillUnmount,
	onMouseDown,
	onMouseUp,
	onMouseMove,
	updateSlider
} from './sliderScripts'

export default class Slider extends Component {
	constructor(props) {
		super(props)
		let {
			position,
			range
		} = this.props
		this.state = {
			position,
			range
		}
		this.slider = createRef()
		bindAll(this, [
			componentDidMount,
			componentWillUnmount,
			onMouseDown,
			onMouseUp,
			onMouseMove,
			updateSlider
		])
	}

	render({
		class: aClass,
		value = '',
		showLabel = false,
		showLabelValue = false,
		showSideValue = true,
		side = 'right',
		useHandle = true
	}, {
		dragStyle = '',
		fillStyle = '',
		labelStyle = '',
		valueStyle = '',
		sideStyle = '',
		isFocus = false
	}) {
		return (
			<ts-slider-wrap
				class={ aClass }
				onMouseDown={ this.onMouseDown }
				onTouchStart={ this.onMouseDown }
			>
				{ showSideValue &&
					<ts-slider-value
						style={ {...valueStyle, ...sideStyle} }
					>
						{ value || 0 }
					</ts-slider-value>
				}
				<ts-slider-area>
					{ showLabel &&
						<ts-slider-label style={ labelStyle } >
							<ts-slider-tip />
						</ts-slider-label>
					}
					{ showLabelValue &&
						<ts-slider-value style={ valueStyle } >
							{ value || 0 }
						</ts-slider-value>
					}
					<ts-slider-backing ref={ this.slider } >
						<ts-slider-fill
							class={ isFocus ? style.focus : '' }
							style={ fillStyle }
						/>
						{ useHandle &&
							<ts-slider-handle
								class={ style.enabled }
								style={ dragStyle }
							/>
						}
					</ts-slider-backing>
				</ts-slider-area>
			</ts-slider-wrap>
		)
	}
}
