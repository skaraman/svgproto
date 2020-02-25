class Hierarchy {
	constructor() {
		this.init()
	}

	init() {
		this.entities = []
		this.gradients = []
	}

	add(nodes) {
		for (let ndx in nodes) {
			let node = nodes[ndx]
			let defaultId = node.svg.defaultId
			let svg = node.svg[defaultId]
			this.gradients.push({
				id: ndx,
				grads: svg.grads
			})
			this.entities.push({
				id: ndx,
				paths: svg.paths,
				viewBox: svg.viewBox,
				width: svg.width,
				height: svg.height,
				transform: node.transform
			})
		}
	}

	update(nodes) {
		// TODO compare the nodes here to the entities already existing
		// add only the new or different ones
		throw 'no update'
	}

	getGradients() {
		return this.gradients
	}

	getEntities() {
		return this.entities
	}
}

export default new Hierarchy
