module.exports = (function () {
    class Input {
        constructor() {
            this._listeners = {
                'click': [],
                'dblclick': [],
                'focus': [],
                'focusin': [],
                'focusout': [],
                'input': [],
                'keydown': [],
                'keypress': [],
                'keyup': [],
                'mousedown': [],
                'mouseenter': [],
                'mouseleave': [],
                'mousemove': [],
                'mouseout': [],
                'mouseover': [],
                'mouseup': [],
                'resize': [],
                'scroll': [],
                'select': [],
                'touchcancel': [],
                'touchend': [],
                'touchmove': [],
                'touchstart': [],
                'wheel': []
            }
            this.triggers = {
                '_click': this._click,
                '_dblclick': this._dblclick,
                '_focus': this._focus,
                '_focusin': this._focusin,
                '_focusout': this._focusout,
                '_input': this._input,
                '_keydown': this._keydown,
                '_keyup': this._keyup,
                '_keypress': this._keypress,
                '_mousedown': this._mousedown,
                '_mouseenter': this._mouseenter,
                '_mouseleave': this._mouseleave,
                '_mousemove': this._mousemove,
                '_mouseout': this._mouseout,
                '_mouseover': this._mouseover,
                '_mouseup': this._mouseup,
                '_resize': this._resize,
                '_scroll': this._scroll,
                '_select': this._select,
                '_touchcancel': this._touchcancel,
                '_touchend': this._touchend,
                '_touchmove': this._touchmove,
                '_touchstart': this._touchstart,
                '_wheel': this._wheel
            }
            for (let i in this._listeners) {
                let self = this;
                document.addEventListener(i, (event) => {
                    self.triggers[`_${i}`].apply(self, [event])
                })
            }
        }

        registerInput(eventId, regId, callback) {
            this._listeners[`_${eventId}`][regId] = { callback, target }
        }

        unregisterInput(eventId, regId) {
            delete this._listeners[`_${eventId}`][regId]
        }

        __applyEvent(id) {
            for (let i in this._listeners[id]) {
                let cb = this._listeners[id][i]
                cb.callback.apply(cb.target, event)
            }
        }

        _click(event) {
            console.log('_click')
            this.__applyEvent('_click', event)
        }
        _dblclick(event) {
            console.log('_dblclick')
            this.__applyEvent('_dblclick', event)
        }
        _focus(event) {
            console.log('_focus()')
            this.__applyEvent('_focus()', event)
        }
        _focusin(event) {
            console.log('_focusin')
            this.__applyEvent('_focusin', event)
        }
        _focusout(event) {
            console.log('_focusout')
            this.__applyEvent('_focusout', event)
        }
        _input(event) {
            console.log('_input')
            this.__applyEvent('_input', event)
        }
        _keydown(event) {
            console.log('_keydown')
            this.__applyEvent('_keydown', event)
        }
        _keyup(event) {
            console.log('_keyup')
            this.__applyEvent('_keyup', event)
        }
        _keypress(event) {
            console.log('_keypress')
            this.__applyEvent('_keypress', event)
        }
        _mousedown(event) {
            console.log('_mousedown')
            this.__applyEvent('_mousedown', event)
        }
        _mouseenter(event) {
            console.log('_mouseenter')
            this.__applyEvent('_mouseenter', event)
        }
        _mouseleave(event) {
            console.log('_mouseleave')
            this.__applyEvent('_mouseleave', event)
        }
        _mousemove(event) {
            //console.log('_mousemove')
            this.__applyEvent('_mousemove', event)
        }
        _mouseout(event) {
            console.log('_mouseout')
            this.__applyEvent('_mouseout', event)
        }
        _mouseover(event) {
            console.log('_mouseover')
            this.__applyEvent('_mouseover', event)
        }
        _mouseup(event) {
            console.log('_mouseup')
            this.__applyEvent('_mouseup', event)
        }
        _resize(event) {
            console.log('_resize')
            this.__applyEvent('_resize', event)
        }
        _scroll(event) {
            console.log('_scroll')
            this.__applyEvent('_scroll', event)
        }
        _select(event) {
            console.log('_select')
            this.__applyEvent('_select', event)
        }
        _touchcancel(event) {
            console.log('_touchcancel')
            this.__applyEvent('_touchcancel', event)
        }
        _touchend(event) {
            console.log('_touchend')
            this.__applyEvent('_touchend', event)
        }
        _touchmove(event) {
            console.log('_touchmove')
            this.__applyEvent('_touchmove', event)
        }
        _touchstart(event) {
            console.log('_touchstart')
            this.__applyEvent('_touchstart', event)
        }
        _wheel(event) {
            console.log('_wheel')
            this.__applyEvent('_wheel', event)
        }
    }

    return new Input()
})()