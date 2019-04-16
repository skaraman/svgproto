class Dispatch {
    constructor() {
        this.notices = {}
    }

    on(notice, callback, target = null) {
        this.notices[notice] = this.notices[notice] || {}
        let len = Object.keys(this.notices[notice]).length
        let name = `${callback.name}${len}`
        this.notices[notice][name] = {
            callback: callback,
            target: target
        }
        return {
            off: function () {
                delete this.notices[notice][name]
            },
            notice: notice
        }
    }

    send(notice) {
        if (!notice || !this.notices.hasOwnProperty(notice)) {
            return
        }
        let callbacks = this.notices[notice]
        let args = []
        for (let i = 1; i < arguments.length; i++) {
            args.push(arguments[i])
        }
        for (let key in callbacks) {
            let obj = callbacks[key]
            let returnobj = obj.callback.apply(obj.target, args)
            if (returnobj) {
                cc.warn('all other calls will fizzle')
                return returnobj
            }
        }
    }
}

module.exports = new Dispatch