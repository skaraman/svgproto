import dispatch from 'util/dispatch'

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
        this.allowAsync = false
        this.asyncTrigger = dispatch.on('allowAsync', this.setAsync, this)
        this._synchedUpdate()
    }

    setAsync(value = true) {
        this.allowAsync = value
        this._asynchedUpdate()
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

    register(id, callback, target, async = false) {
        this.callbacks[id] = {
            callback,
            target,
            async
        }
    }

    unregister(id) {
        delete this.callbacks[id]
    }

    _asynchedUpdate() {
        if (this.pause) {
            return
        }
        let deltatime = this._getPerformance() - this.lastupdate
        this.lastupdate = this._getPerformance()
        for (let cbIndex in this.callbacks) {
            let callback = this.callbacks[cbIndex]
            if (callback.async) callback.callback.apply(callback.target, [deltatime, 'async'])
        }

        // // TODO: find a way to make this work without infinite call stack
        //this._asynchedUpdate()
    }

    _synchedUpdate() {
        if (this.pause) {
            return
        }
        window.requestAnimationFrame(this._synchedUpdate.bind(this))
        let deltatime = this._getPerformance() - this.lastupdate
        this.lastupdate = this._getPerformance()
        for (let cbIndex in this.callbacks) {
            let callback = this.callbacks[cbIndex]
            callback.callback.apply(callback.target, [deltatime, 'sync'])
        }
    }

    _getPerformance() {
        return this.perf.now()
    }
}

export default new Updater