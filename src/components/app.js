import { h, Component } from 'preact'
import { Router } from 'preact-router'

import DevUI from 'components/devui'
import Terminal from 'components/devui/terminal'
import BlackScreen from 'components/game/blackscreen'
import DnD from 'components/game/donotdestroy'

import MainMenu from 'scenes/mainmenu'
import TestScene from 'scenes/testscene'
import Loading from 'scenes/loading'
import Settings from 'scenes/settings'
import PocaDemo from 'scenes/pocademo'

import cache from 'util/cache'

const isDev = true

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
      isDev,
    })
    cache.META_DATA.manifest = 'loadingScene'
    cache.META_DATA.exitRoute = '/mainmenu'
  }

  render({}, { isDev }) {
    return (
      <div id='app'>
        {
          isDev && <DevUI />
        }
        <BlackScreen/>
        <Router onChange={this.handleRoute}>
          <Loading path='/' />
          <TestScene path='/testscene' />
          <MainMenu path='/mainmenu' />
          <Settings path='/settings' />
          <PocaDemo path='/pocademo' />
        </Router>
        <DnD/>
        {
          isDev && <Terminal/>
        }
      </div>
    )
  }
}