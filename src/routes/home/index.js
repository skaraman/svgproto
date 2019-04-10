import { h, Component } from 'preact';
import style from './style';

import Terminal from 'components/terminal';

import Box from '!!preact-svg-loader!svg/test/box.svg';
import svgson, { stringify } from 'svgson';

export default class Home extends Component {

    componentDidMount() {
        this.box;
        debugger
    }

    render({}, {}) {
        console.log(
            svgson(Box)
        );
        return (
            <div class={style.home}>
                <p>There should be a SVG Box...</p>
                <Box ref={box => this.box = box}/>

                <Terminal />
            </div>
        );
    }
}
