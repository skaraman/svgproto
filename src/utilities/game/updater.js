class Updater {
	constructor() {
		if (!performance) {
			console.error('bad browser')
			return
		}
		this.lastupdate = 0
		this.callbacks = {}
		this.unpausableCallbacks = {}
		this.isPaused = false
		this.stepEnabled = false
		this.notRealtimeStep = false
		this._update()
	}

	pause() {
		this.toggle(false)
	}

	play() {
		this.toggle(true)
	}

	step() {
		this.stepEnabled = true
		this._update()
	}

	toggle(activate = null) {
		if (activate === null) {
			activate = this.isPaused
		}
		if (this.isPaused) {
			this.wasPaused = true
		}
		if (this.isPaused !== activate) {
			return
		}
		this.isPaused = !activate
		this._update()
	}

	register(id, callback, target, type = 'update') {
		switch (type) {
			case 'update':
				this.callbacks[id] = {
					callback,
					target
				}
				break
			case 'preUpdate':
				this.preCallbacks[id] = {
					callback,
					target
				}
				break
			case 'postUpdate':
				this.postCallbacks[id] = {
					callback,
					target
				}
				break
			case 'unpausable':
				this.unpausableCallbacks[id] = {
					callback,
					target
				}
				break
		}
	}

	unregister(id) {
		delete this.callbacks[id]
	}

	_update() {
		let deltatime = performance.now() - this.lastupdate
		this._unpausableUpdate(deltatime)
		if (this.isPaused && !this.stepEnabled) {
			return
		}
		if (this.stepEnabled || this.wasPaused || (this.notRealtimeStep && deltatime > 16)) {
			deltatime = 16
			this.wasPaused = false
		}
		this._preUpdate(deltatime)
		this.lastupdate = performance.now()
		for (let cbIndex in this.callbacks) {
			let cb = this.callbacks[cbIndex]
			cb.callback.apply(cb.target, [deltatime])
		}
		this._postUpdate(deltatime)
		if (this.stepEnabled) {
			this.stepEnabled = false
		}
		window.requestAnimationFrame(this._update.bind(this))
	}

	_preUpdate(deltatime) {
		for (let cbIndex in this.preCallbacks) {
			let cb = this.preCallbacks[cbIndex]
			cb.callback.apply(cb.target, [deltatime])
		}
	}

	_postUpdate(deltatime) {
		for (let cbIndex in this.postCallbacks) {
			let cb = this.postCallbacks[cbIndex]
			cb.callback.apply(cb.target, [deltatime])
		}
	}

	_unpausableUpdate(deltatime) {
		for (let cbIndex in this.unpausableCallbacks) {
			let cb = this.unpausableCallbacks[cbIndex]
			cb.callback.apply(cb.target, [deltaTime])
		}
	}
}

export default new Updater
