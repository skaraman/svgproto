import dispatch from 'util/data/dispatch'

export function setup(type, messages) {
	let worker;
	if (type === 'loader') {
		worker = new Worker('util/data/loader', { type: 'module' })
	}
	if (type === 'files') {
		worker = new Worker('util/data/files', { type: 'module' })
	}
	worker.onmessage = event => {
		if (event.data && !event.data.msg) {
			return
		}
		for (let message of messages) {
			if (event.data.msg === message) {
				dispatch.send(message, event.data.data)
			}
		}
	}
	return worker
}
