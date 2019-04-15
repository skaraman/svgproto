import { h, Component } from 'preact'
import { Router } from 'preact-router'

import DevUI from 'components/devui'
import Terminal from 'components/terminal'

// Code-splitting is automated for routes
import Home from 'routes/home'
import Profile from 'routes/profile'

export default class App extends Component {

    /** Gets fired when the route changes.
     *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
     *	@param {string} event.url	The newly routed URL
     */
    handleRoute = e => {
        this.currentUrl = e.url
    }

    render() {
        return (
            <div id="app">
                <DevUI />
                <Router onChange={this.handleRoute}>
                    <Home path="/" />
                    <Profile path="/profile/" user="me" />
                    <Profile path="/profile/:user" />
                </Router>
                <Terminal />
            </div>
        )
    }
}