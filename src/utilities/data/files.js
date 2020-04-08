import { bindAll } from 'util/data/helpers'
import dispatch from 'util/data/dispatch'

class Files {
	constructor() {
		bindAll(this, ['read', 'write'])
		this.fs = self.webkitRequestFileSystemSync(
			self.TEMPORARY,
			undefined
		)
		if (this.fs) {
			postMessage({ msg: 'fsSuccess', data: true })
		}
		self.addEventListener('message', event => {
			if (event.data && !event.data.msg) {
				return
			}
			switch (event.data.msg) {
			case 'read':
				this.read(event.data.data)
				break
			case 'write':
				this.write(event.data.data)
			}
		})
	}

	read(name) {
		let fileEntry = this.fs.root.getFile(name, {})
		let file = fileEntry.file()
		let reader = new FileReaderSync()
		let text = reader.readAsText(file)
		postMessage({ msg: 'readingComplete', data: { name, text }})
	}

	write({ name, text }) {
		let fileEntry = this.fs.root.getFile(name, { create: true })
		let fileWriter = fileEntry.createWriter()
		let blob = new Blob([text], { type: 'text/plain' })
		fileWriter.write(blob)
		console.log('Writing complete');
	}
}

let files = new Files()
