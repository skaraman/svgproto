class Updater {
  constructor() {
    this.perf = window.performance
    if (!this.perf) {
      console.error('bad browser')
      return
    }
    this.lastupdate = 0
    this.callbacks = {}
    this.pause = false
    this._step = false
    this._notRealtimeStep = true
    this._update()
  }

  pause() {
    this.toggle(false)
  }

  play() {
    this.toggle(true)
  }

  step() {
    this._step = true
    this._update()
  }

  toggle(activate = null) {
    if (activate === null) activate = this.pause
    this.pause = !activate
    this._update()
  }

  register(id, callback, target, type = 'update') {
    if (type === 'update') {
      this.callbacks[id] = {
        callback,
        target
      }
    }
    if (type === 'preUpdate') {
      this.preCallbacks[id] = {
        callback,
        target
      }
    }
    if (type === 'postUpdate') {
      this.postCallbacks[id] = {
        callback,
        target
      }
    }
  }

  unregister(id) {
    delete this.callbacks[id]
  }

  _update() {
    if (this.pause && !this._step) return
    let deltatime = this.perf.now() - this.lastupdate
    if (this._step && this._notRealtimeStep) deltatime = 16
    this._preUpdate(deltatime)
    this.lastupdate = this.perf.now()
    for (let cbIndex in this.callbacks) {
      let cb = this.callbacks[cbIndex]
      cb.callback.apply(cb.target, [deltatime])
    }
    this._postUpdate(deltatime)
    if (this._step) this._step = false
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
}

export default new Updater