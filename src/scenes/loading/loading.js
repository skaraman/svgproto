import { h, Component, Fragment } from 'preact'
import { route } from 'preact-router'
import style from './loading.css'
import input from 'util/game/input'
import updater from 'util/game/updater'
import dispatch from 'util/data/dispatch'
import animator from 'util/game/animator'
import cache from 'util/data/cache'
import { bindAll } from 'util/data/helpers'
import Stage from 'components/game/stage'
import { setup } from 'util/data/setup'
import { initilize } from './scripts'

let loader = setup('loader', ['loadingComplete'])

export default class Loading extends Component {
	constructor(props) {
		super(props)
		this.loader = loader
		input.register('keydown', 'loadingKeydown', this._keydown, this)
		updater.register('loadingUpdate', this._update, this)
		this.on = [
			dispatch.on('loadingComplete', this._loadingComplete, this),
			dispatch.on('fs success', this._fsReady, this)
		]
		this.deltaTime = 0
		this.notRealTime = true
		this.it = 0
		this.loadingTextArr = [
			'Loading...',
			`Loading ..`,
			`Loading  .`,
			'Loading   ',
			'Loading.  ',
			'Loading.. '
		]
		bindAll(this, [initilize])
	}

	componentDidMount() {
		dispatch.send('fadeOutBS')
		if (!cache.META_DATA.manifest ||
			!cache.META_DATA.exitRoute) {
			throw `Initial loading loop flaw`
		}
		// first loading loop doesn't have any cached SVGs, this should be used as the Initial
		// black screen during which company logos and loading scenes/aniamtions can be loaded
		let entities = initilize()
		this.setState({
			entities
		})
		this.loader.postMessage({ msg: 'load', data: cache.META_DATA.manifest })
	}

	_update(dt) {
		if (this.notRealTime) {
			if (dt > 16) {
				dt = 16
			}
		}
		this.deltaTime += dt
		if (this.deltaTime > 500) {
			let loadingText = this.loadingTextArr[this.it]
			this.setState({
				loadingText
			})
			this.it++
			if (this.it >= this.loadingTextArr.length) {
				this.it = 0
			}
			this.deltaTime = 0
		}
	}

	_keydown(event) {
		console.log('loadingKeydown', event)
	}

	_loadingComplete(SVGS) {
		console.log('Loading Completed')
		this.lc = true
		this.SVGS = SVGS
		this.attemptLoadingDone()
	}

	_fsReady() {
		console.log('File System Ready')
		this.fsr = true
		this.attemptLoadingDone()
	}

	attemptLoadingDone = () => {
		if (this.fsr === true && this.lc === true) {
			cache.setSVGS(this.SVGS)
			this.statics = this.SVGS.statics
			dispatch.send('svgs ready')
			dispatch.send('fadeInBS', this.exit)
		}
	}

	exit = () => {
		input.unregister('keydown', 'loadingKeydown')
		updater.unregister('loadingUpdate')
		animator.kill('loadingAnimation')
		for (let o = 0; o < this.on.length; o++) {
			this.on[o].off()
		}
		this.on = []
		route(cache.META_DATA.exitRoute + window.location.search)
	}

	render({}, { loadingText, entities }) {
		return (
			<ts-loading>
				{
					entities &&
					<Stage class={ style.stage } >
						{ entities }
					</Stage>
				}
				<ts-effects>
					<ts-text>{loadingText}</ts-text>
				</ts-effects>
			</ts-loading>
		)
	}
}
