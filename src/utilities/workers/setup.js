import dispatch from 'util/dispatch'
let loader = new Worker('util/workers/loader', { type: 'module' })

export function loaderSetup(messages) {

	loader.onmessage = event => {
		if (event.data && !event.data.msg) {
			return
		}
		for (let message of messages) {
			if (event.data.msg === message) {
				dispatch.send(message, event.data.data)
			}
		}
	}

	return loader
}
