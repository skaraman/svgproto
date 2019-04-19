import { h, Component } from 'preact'
import style from './loading.css'

import input from 'util/input'
import updater from 'util/updater'
import Loader from 'util/loader'
import dispatch from 'util/dispatch'



export default class Loading extends Component {
    constructor(props) {
        super(props)
        this.loader = new Loader(undefined, false)
        input.registerInput('keydown', 'homeKeydown', this.keydown, this)
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
            'Loading.. ',
        ]
    }

    keydown(event) {
        console.log('homeKeydown', event)
    }

    play(event) {
        console.log('play')
        event.stopPropagation()
    }

    componentWillMount() {
        this.loader.loadSVGs()
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

    loadingComplete() {
        console.log('Loading Completed')
    }

    render({}, { loadingText }) {
        return (
            <div class={style.loading}>
                <p>{loadingText}</p>
            </div>
        )
    }
}
