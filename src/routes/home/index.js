import { h, Component } from 'preact'
import style from './style'

import input from 'util/input'
import Loader from 'util/loader'
import Button from 'components/ui/button'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.loader = new Loader(true)
        input.registerInput('keydown', 'homeKeydown', this.keydown, this)
    }

    keydown(event) {
        console.log('homeKeydown', event)
    }

    play(event) {
        console.log('play')
        event.stopPropagation()
    }

    render({}, {}) {

        return (
            <div class={style.home}>
                <Button
                    text='Play'
                    onClick={this.play}
                />
                <p>There should be a SVG Box...</p>
            </div>
        )
    }
}
