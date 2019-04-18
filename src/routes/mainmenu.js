import { h, Component } from 'preact'
import style from './mainmenu.css'

import input from 'util/input'
import Loader from 'util/loader'
import Button from 'components/ui/button'

export default class MainMenu extends Component {
    constructor(props) {
        super(props)
        // this.loader = new Loader(undefined, undefined, true)
        // input.registerInput('keydown', 'homeKeydown', this.keydown, this)
    }

    keydown(event) {
        console.log('mainMenuKeydown', event)
    }

    play(event) {
        console.log('play')
        event.stopPropagation()
    }

    render({}, {}) {

        return (
            <div class={style.mainMenu}>
                <div class={style.mainMenuText}>Main Menu</div>
                <Button
                    text='Start Game'
                    onClick={this.play}
                />
                <Button
                    text='Settings'
                    onClick={this.settings}
                />
                <p>copyright and trademark stuff</p>
            </div>
        )
    }
}