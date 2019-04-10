import { h, Component } from 'preact'
import style from './style'

import Terminal from 'components/terminal'

import Box from '!!preact-svg-loader!svg/test/box.svg'
import svgson, { stringify } from 'svgson'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.svgsToRender = {
            box: true,
            star: true
        }
        console.log(Box({}))
    }

    componentWillMount() {
        console.log('componentWillMount');
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
    }

    componentWillReceiveProps() {
        console.log('componentWillReceiveProps');
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate');
    }

    componentWillUpdate() {
        console.log('componentWillUpdate');
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
    }

    //
    // shouldComponentUpdate() {
    //     for (let svgdx in this.svgsToRender) {
    //         let svg = this[svgdx]
    //         if (!svg) return false
    //     }
    //     return true
    // }

    render({}, {}) {

        return (
            <div class={style.home}>
                <p>There should be a SVG Box...</p>
                <Box ref={box => this.box = box}/>

                <Terminal />
            </div>
        )
    }
}
