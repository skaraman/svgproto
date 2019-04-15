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
        this._update()
    }

    pause() {
        this.toggle(false)
    }

    play() {
        this.toggle(true)
    }

    toggle(activate) {
        this.pause = !activate
    }

    register(id, callback, target) {
        this.callbacks[id] = {
            callback,
            target
        }
    }

    unregister(id) {
        delete this.callbacks[id]
    }

    _update() {
        if (this.pause) {
            return
        }
        window.requestAnimationFrame(this._update.bind(this))
        let deltatime = this._getPerformance() - this.lastupdate
        this.lastupdate = this._getPerformance()
        for (let cbIndex in this.callbacks) {
            let callback = this.callbacks[cbIndex]
            callback.callback.apply(callback.target, [deltatime])
        }
    }

    _getPerformance() {
        return this.perf.now()
    }
}

module.exports = new Updater