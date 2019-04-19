import { h, Component } from 'preact'
import { Router } from 'preact-router'

import DevUI from 'components/devui'
import Terminal from 'components/devui/terminal'

import MainMenu from 'scenes/mainmenu'
import TestScene from 'scenes/testscene'
import Loading from 'scenes/loading'

import cache from 'util/cache'

export default class App extends Component {

    /** Gets fired when the route changes.
     *	@param {Object} event		'change' event from [preact-router](http://git.io/preact-router)
     *	@param {string} event.url	The newly routed URL
     */
    handleRoute = e => {
        this.currentUrl = e.url
    }

    componentWillMount() {
        this.setState({
            isDev: true,
        })
    }

    render({}, { isDev }) {
        return (
            <div id='app'>
                {
                    isDev &&
                    <DevUI />
                }
                <Router onChange={this.handleRoute}>
                    <Loading path='/' />
                    <TestScene path='/testscene'/>
                    <MainMenu path='/mainmenu' />
                </Router>
                {
                    isDev &&
                    <Terminal />
                }
            </div>
        )
    }
}
