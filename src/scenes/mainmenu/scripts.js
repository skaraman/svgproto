export function initilize(statics) {
	let entitiesList = [{
		id: 'colorChar',
		x: -150,
		anchor: [0, -1],
		scale: 0.8
	}]
	let entities = {}
	for (let act of entitiesList) {
		let { id = act, ...rest } = act
		let entity = statics[id]
		entities[id] = {
			id,
			entity,
			transform: {
				...rest
			}
		}
	}
	return entities
}
