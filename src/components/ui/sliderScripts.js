import { isDefined } from 'util/data/helpers'

const VERT = 'vertical'
const HORZ = 'horizontal'

export function componentDidMount() {
	window.addEventListener('mouseup', this.onMouseUp)
	window.addEventListener('mousemove', this.onMouseMove)
	window.addEventListener('touchend', this.onMouseUp)
	window.addEventListener('touchmove', this.onMouseMove)
}

export function componentWillUnmount() {
	let { focusTimeout } = this.state
	clearTimeout(focusTimeout)
	window.removeEventListener('mouseup', this.onMouseUp)
	window.removeEventListener('mousemove', this.onMouseMove)
	window.removeEventListener('touchend', this.onMouseUp)
	window.removeEventListener('touchmove', this.onMouseMove)
}

export function onMouseDown() {
	this.setState({
		update: true
	})
};

export function onMouseMove(event) {
	let { update } = this.state
	let { type } = this.props
	if (update) {
		if (!isDefined(event.pageX)) {
			event.pageX = event.touches[0].pageX;
		}
		if (type === VERT){
			if (!isDefined(event.pageY)) {
				event.pageY = event.touches[0].pageY;
			}
		}
		this.updateSlider(event);
	}
}

export function onMouseUp(event) {
	let {
		update,
		focusTimeout,
		sliderUpdateInterval
	} = this.state
	if (update) {
		this.setState({
			update: false
		})
		clearInterval(sliderUpdateInterval)
		if (focusTimeout) {
			clearTimeout(focusTimeout);
			this.setState({
				focusTimeout: null
			})
		}
		this.setState({
			sliderUpdateInterval: false
		})
		if (event.pageX || event.pageY) {
			this.updateSlider(event);
		}
	}
	this.setState({
		focusTimeout: setTimeout(() => {
			this.setState(({ position }) => ({
				position,
				isFocus: false
			}))
		}, 1000)
	})
}

export function updateSlider(event) {
		let dragStyle,
			fillStyle,
			labelStyle,
			valueStyle,
			sideStyle
		let {
			side = 'right',
			type = HORZ
		} = this.props;
		let sliderValue
		let sliderRect = this.slider.current.getBoundingClientRect()
		if (event.pageX) {
			sliderValue = (Math.min(
				1,
				Math.max(
					0,
					(event.pageX - sliderRect.left) / sliderRect.width
				)
			))
		}
		if (event.pageY && type === VERT) {
			sliderValue = (Math.min(
				1,
				Math.max(
					0,
					(event.pageY - sliderRect.top) / sliderRect.height
				)
			))
		}
		let position = sliderValue * 100
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
			if (side === 'right') {
				sideStyle = {
					float: 'right'
				}
			}
			else {
				sideStyle = {
					float: 'left'
				}
			}
		}
		this.setState({
			dragStyle,
			fillStyle,
			labelStyle,
			valueStyle,
			sideStyle,
			isFocus: true
		})
		if (this.props.onUpdate) {
			this.props.onUpdate(parseFloat(sliderValue).toFixed(3));
		}
	}
