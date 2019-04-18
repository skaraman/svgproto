import { h, Component } from 'preact'
import { Router } from 'preact-router'

import DevUI from 'components/devui'
import Terminal from 'components/terminal'

// Code-splitting is automated for routes
import MainMenu from 'routes/mainmenu'
import TestScene from 'routes/testscene'
import Loading from 'routes/loading'

import cache from 'util/cache'

export default class App extends Component {

    /** Gets fired when the route changes.
     *	@param {Object} event		'change' event from [preact-router](http://git.io/preact-router)
     *	@param {string} event.url	The newly routed URL
     */
    handleRoute = e => {
        this.currentUrl = e.url
    }

    render() {
        return (
            <div id='app'>
                <DevUI />
                <Router onChange={this.handleRoute}>
                    <Loading path='/' />
                    <TestScene path='/testscene'/>
                    <MainMenu path='/mainmenu' />
                </Router>
                <Terminal />
            </div>
        )
    }
}