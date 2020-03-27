class Hierarchy {
	constructor() {
		this.init()
	}

	init() {
		this.entities = []
		this.entitiesById = {}

		this.gradients = []
		this.gradientsById = {}
	}

	add(children) {
		for (let cdx in children) {
			let child = children[cdx]
			let defaultId = child.svg.defaultId
			let svg = child.svg[defaultId]
			this.gradients.push(this.gradientsById[cdx] = {
				id: cdx,
				grads: svg.grads
			})
			this.entities.push(this.entitiesById[cdx] = {
				id: cdx,
				frame: defaultId,
				paths: svg.paths,
				viewBox: svg.viewBox,
				width: svg.width,
				height: svg.height,
				transform: child.transform
			})

		}
	}

	update(children) {
		// TODO compare the children here to the entities already existing
		// add only the new or different ones
		throw 'no update'
	}

	getGradients() {
		return this.gradients
	}

	getGradientsById() {
		return this.gradientsById
	}

	getEntities() {
		return this.entities
	}

	getEntitiesById() {
		return this.entitiesById
	}

	getEntityById(id) {
		return this.entitiesById[id]
	}
}

export default new Hierarchy
