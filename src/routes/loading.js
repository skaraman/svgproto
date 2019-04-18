import { h, Component } from 'preact'
import style from './loading.css'

import input from 'util/input'
import Loader from 'util/loader'


export default class Loading extends Component {
    constructor(props) {
        super(props)
        this.loader = new Loader(undefined, false)
        input.registerInput('keydown', 'homeKeydown', this.keydown, this)
    }

    keydown(event) {
        console.log('homeKeydown', event)
    }

    play(event) {
        console.log('play')
        event.stopPropagation()
    }

    componentWillMount() {
        debugger
        this.loader.loadSVGs()
    }

    render({}, {}) {

        return (
            <div class={style.loading}>
                <p>Loading...</p>
            </div>
        )
    }
}