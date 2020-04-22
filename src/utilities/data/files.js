import { bindAll } from 'util/data/helpers'
import dispatch from 'util/data/dispatch'

class Files {
	constructor() {
		bindAll(this, ['read', 'write'])
		this.fs = self.webkitRequestFileSystemSync(
			self.TEMPORARY,
			undefined
		)
		this.reader = new FileReaderSync()
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
		let text = this.reader.readAsText(file)
		postMessage({ msg: 'readingComplete', data: { name, text }})
	}

	write({ name, text }) {
		let fileEntry = this.fs.root.getFile(name, { create: true })
		let file = fileEntry.file()
		let testText = this.reader.readAsText(file)
		if (testText) {
			fileEntry.remove()
			this.write({ name, text })
			return
		}
		let blob = new Blob([text], { type: 'text/plain' })
		let fileWriter = fileEntry.createWriter()
		fileWriter.write(blob)
	}
}

let files = new Files()
