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

	add(entities) {
		for (let cdx in entities) {
			let { id, entity, transform } = entities[cdx]
			let defaultId = entity.defaultId
			let {
				grads,
				paths,
				viewBox,
				width,
				height
			} = entity[defaultId]
			if (!this.gradientsById[cdx]) {
				this.gradients.push(this.gradientsById[cdx] = {
					id: cdx,
					grads: grads
				})
			}
			if (!this.entities[cdx]) {
				this.entities.push(this.entitiesById[cdx] = {
					id,
					frame: defaultId,
					paths,
					viewBox,
					width,
					height,
					transform
				})
			}
		}
	}

	addMeshes(meshes) {
		for (let cdx in meshes) {
			let entityMeshes = meshes[cdx]
			if (!this.entities[cdx]) {
				this.entities.push(this.entitiesById[cdx] = entityMeshes)
			}
		}
	}

	update(entities) {
		// TODO compare the entities passed in here to
		// the this.entities already existing
		// add only the new or different ones
		throw 'no update'
	}

	removeAll() {
		this.init()
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
