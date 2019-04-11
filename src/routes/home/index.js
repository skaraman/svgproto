import { h, Component } from 'preact'
import style from './style'

import Loader from 'util/loader'
import Button from 'components/ui/button'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.loader = new Loader(true)
    }

    componentWillMount() {
        console.log('componentWillMount')
    }

    componentDidMount() {
        console.log('componentDidMount')
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
    }

    componentWillReceiveProps() {
        console.log('componentWillReceiveProps')
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate')
    }

    componentWillUpdate() {
        console.log('componentWillUpdate')
    }

    componentDidUpdate() {
        console.log('componentDidUpdate')
    }

    playClick() {
        console.log('playClick')
    }

    render({}, {}) {

        return (
            <div class={style.home}>
                <Button
                    text='Play'
                    onClick={this.playClick}
                />
                <p>There should be a SVG Box...</p>
            </div>
        )
    }
}