import { h, Component } from 'preact'
import style from './options.css'

import dispatch from 'util/dispatch'

export default class Options extends Component {
    constructor(props) {
        super(props)

    }

    allowAsync() {
        dispatch.send('allowAsync')
    }

    render({}, { fps }) {
        //console.log(fps)
        return (
            <div class={style.options}>
                {/*
                    <input type="checkbox" id="allowAsync" onclick={this.allowAsync} /> Allow Async-->
                */}
            </div>
        )
    }
}