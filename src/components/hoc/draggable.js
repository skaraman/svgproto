import input from 'util/game/input'


export default function draggable(target) {
	if (target) {
		if (target.prototype.componentDidMount){
			target.prototype.oldComponentDidMount = target.prototype.componentDidMount
		}
		target.prototype.componentDidMount = componentDidMount
	}
}

function componentDidMount() {
	this.moveDevUI = function (event) {
		let { clientX, clientY } = event
		let {
			xPos = 0,
			yPos = 0,
			startSet,
			startX,
			startY
		} = this.state
		if (!startSet) {
			startX = clientX - xPos
			startY = clientY - yPos
			startSet = true
			this.setState({
				startX,
				startY,
				startSet
			})
		}
		xPos = (clientX - startX)
		yPos = (clientY - startY)
		this.setState({
			xPos,
			yPos
		})
	}.bind(this)

	this.drag = function (event) {
		event.stopPropagation()
		input.register(
			'mousemove',
			this.constructor.name,
			this.moveDevUI,
			this
		)
	}.bind(this)

	this.dragStop = function (event) {
		event.stopPropagation()
		input.unregister('mousemove', this.constructor.name)
		this.setState({
			startSet: false
		})
	}.bind(this)

	this.setState({
		dragBound: true
	})

	this.oldComponentDidMount && this.oldComponentDidMount();
}
