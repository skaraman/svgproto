import './style'
import polyfill from 'util/polyfill'
import App from './components/app'
import registerServiceWorker from 'util/workers/registerServiceWorker'
registerServiceWorker()
export default App