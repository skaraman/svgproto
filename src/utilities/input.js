module.exports = (function () {
  class Input {
    constructor() {
      this._listeners = {
        'click': {},
        'dblclick': {},
        'focus': {},
        'focusin': {},
        'focusout': {},
        'input': {},
        'keydown': {},
        'keypress': {},
        'keyup': {},
        'mousedown': {},
        'mouseenter': {},
        'mouseleave': {},
        'mousemove': {},
        'mouseout': {},
        'mouseover': {},
        'mouseup': {},
        'resize': {},
        'scroll': {},
        'select': {},
        'touchcancel': {},
        'touchend': {},
        'touchmove': {},
        'touchstart': {},
        'wheel': {}
      }
      for (let i in this._listeners) {
        let self = this
        document.addEventListener(i, (event) => {
          self.__applyEvent.apply(self, [i, event])
        }, i === 'wheel' ? { passive: true } : undefined)
      }
    }

    register(eventId, regId, callback, target) {
      this._listeners[eventId][regId] = { callback, target }
    }

    unregister(eventId, regId) {
      delete this._listeners[eventId][regId]
    }

    __applyEvent(id, event) {
      //console.log(id)
      for (let i in this._listeners[id]) {
        let cb = this._listeners[id][i]
        cb.callback.apply(cb.target, [event])
      }
    }
  }

  return new Input()
})()
