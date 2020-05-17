import { h, Component, createRef } from 'preact'
import style from './slider.css'
import classnames from 'classnames'
import { isDefined } from 'util/data/helpers'

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
	}

	componentWillMount() {
		window.addEventListener('mouseup', this.onMouseup)
		window.addEventListener('mousemove', this.onMousemove)
		window.addEventListener('touchend', this.onMouseup)
		window.addEventListener('touchmove', this.onMousemove)

	}

	componentWillUnmount() {
		clearTimeout(this.focusTimeout);
		window.removeEventListener('mouseup', this.onMouseup)
		window.removeEventListener('mousemove', this.onMousemove)
		window.removeEventListener('touchend', this.onMouseup)
		window.removeEventListener('touchmove', this.onMousemove)
	}

	onMouseDown = () => {
		this.update = true;
	}

	onMousemove = (event) => {
		if (this.update) {
			if (!isDefined(event.pageX)) { // for touch devices
				event.pageX = event.touches[0].pageX;
			}
			this.updateSlider(event);
		}
	}

	onMouseup = (event) => {
		if (this.update) {
			this.update = false;
			clearInterval(this.sliderUpdateInterval);
			if (this.focusTimeout) {
				clearTimeout(this.focusTimeout);
				this.focusTimeout = null;
			}
			this.sliderUpdateInterval = false;
			if (event.pageX) { // for non touch devices
				this.updateSlider(event);
			}
		}
		this.focusTimeout = setTimeout(() => {
			this.setState(state => ({
				position: state.position,
				isFocus: false
			}));
		}, 1000);
	}

	updateSlider(event) {
		let { label } = this.props;
		let sliderRect = this.slider.current.getBoundingClientRect()
		this.sliderValue = (Math.min(1, Math.max(0, (event.pageX - sliderRect.left) / sliderRect.width)))
		this.sliderData = { [label]: parseFloat(this.sliderValue).toFixed(3) }
		this.setState({
			position: this.sliderValue * 100,
			isFocus: true
		})
		if (this.props.onUpdateSettings) {
			this.props.onUpdateSettings(this.sliderData);
		}
	}

	render({
		class: aClass,
		value = '',
		showLabel = false,
		showValue = true,
		useHandle = true
	}, {
		position,
		isFocus = false
	}) {
		let dragStyle = '',
			fillStyle = '',
			labelStyle = '',
			valueStyle = ''
		if (position || position === 0) {
			let labelAndValuePos = 7
			dragStyle = {
				left: `${ position }%`
			}
			fillStyle = {
				width: `${ position + 1.5 }%`
			}
			labelStyle = {
				left: `${ position - labelAndValuePos }%`
			}
			valueStyle = {
				left: `${ position - labelAndValuePos }%`
			}
		}
		return (
			<ts-slider-wrap
				class={ aClass }
				onMouseDown={ this.onMouseDown }
				onTouchStart={ this.onMouseDown }
			>
				<ts-slider-area>
					{ showLabel &&
						<ts-slider-label style={ labelStyle } >
							<ts-slider-tip />
						</ts-slider-label>
					}
					{ showValue &&
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
