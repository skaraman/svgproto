import dispatch from 'util/data/dispatch'

export function worker(type, messages) {
	let wrkr;
	if (type === 'loader') {
		wrkr = new Worker('util/data/loader', { type: 'module' })
	}
	if (type === 'files') {
		wrkr = new Worker('util/data/files', { type: 'module' })
	}
	wrkr.onmessage = event => {
		if (event.data && !event.data.msg) {
			return
		}
		for (let message of messages) {
			if (event.data.msg === message) {
				dispatch.send(message, event.data.data)
			}
		}
	}
	return wrkr
}
