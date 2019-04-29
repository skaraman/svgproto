import { h, Component } from 'preact'
import { route } from 'preact-router'
import style from './loading.css'

import input from 'util/input'
import updater from 'util/updater'
import loader from 'util/loader'
import dispatch from 'util/dispatch'
import cache from 'util/cache'

export default class Loading extends Component {
    constructor(props) {
        super(props)
        input.register('keydown', 'loadingKeydown', this.keydown, this)
        updater.register('loadingUpdate', this.update, this)
        this.on = [
            dispatch.on('loadingComplete', this.loadingComplete, this)
        ]
        this.deltaTime = 0
        this.it = 0
        this.loadingTextArr = [
            'Loading...',
            'Loading ..',
            'Loading  .',
            'Loading   ',
            'Loading.  ',
            'Loading.. '
        ]
    }

    _exit() {
        input.unregister('keydown', 'loadingKeydown')
        updater.unregister('loadingUpdate')
        for (let o = 0; o < this.on.length; o++) {
            this.on[o].off()
        }
        this.on = []
    }

    keydown(event) {
        console.log('loadingKeydown', event)
    }

    componentDidMount() {
        dispatch.send('fadeOutBS')
        let manifest = cache.META_DATA.manifest
        let exitRoute = cache.META_DATA.exitRoute
        if (manifest && exitRoute) this.loadScene(manifest, exitRoute)
    }

    update(dt) {
        this.deltaTime += dt
        if (this.deltaTime > 500) {
            let loadingText = this.loadingTextArr[this.it]
            this.setState({
                loadingText
            })
            this.it++
            if (this.it >= this.loadingTextArr.length) this.it = 0
            this.deltaTime = 0
        }
    }

    loadScene(manifest, exitRoute) {
        this.exitRoute = exitRoute
        loader.load(manifest)
    }

    loadingComplete() {
        console.log('Loading Completed')
        dispatch.send('fadeInBS', () => {
            this._exit()
            route(this.exitRoute)
        })

    }

    render({}, { loadingText }) {
        return (
            <div class={style.loading}>
                <p>{loadingText}</p>
            </div>
        )
    }
}