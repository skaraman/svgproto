import * as SAT from 'sat'

class Physics {
	constructor() {
		this.bodies = {}
		this.constraints = {
			top: undefined,
			bottom: undefined,
			left: undefined,
			right: undefined
		}
	}

	setConstraint(side, value) {
		this.constraints[side] = value
	}

	addBody(svgElem, inertia, constrained) {
		debugger
		let points 
		this.bodies[id] = new Body({
			id,
			inertia,
			constrained,
			pathCollider: new SAT.Polygon(position, points, angle, offset)
		})
	}

	calculateCollisionVelocity() {

	}
}

class Body {
	constructor({
		id,
		inertia,
		constrained,
		pathCollider
	}) {
		this.id = id
		this.inertia = inertia
		this.constrained = constrained
		this.pathCollider = pathCollider
	}

	setConstrained(value) {
		this.constrained = value
	}
}

export default new Physics