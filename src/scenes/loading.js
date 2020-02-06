import { h, Component } from 'preact'
import { route } from 'preact-router'
import style from './loading.css'

import input from 'util/input'
import updater from 'util/updater'
import dispatch from 'util/dispatch'
import animator from 'util/animator'
import { cache } from 'util/cache'
import { bindAll } from 'util/helpers'

import SVGWrap from 'components/ui/svgwrap'

let loaderWorker = new Worker('util/workers/loaderWorker', { type: 'module' })
loaderWorker.onmessage = event => {
	if (event.data && !event.data.msg) return
	if (event.data.msg === 'loadingComplete') dispatch.send('loadingComplete', event.data.data)
}

export default class Loading extends Component {
	constructor(props) {
		super(props)
		input.register('keydown', 'loadingKeydown', this.keydown, this)
		updater.register('loadingUpdate', this.update, this)
		this.on = [
			dispatch.on('loadingComplete', this.loadingComplete, this)
		]
		bindAll(this, ['_exit'])
		this.deltaTime = 0
		this.notRealTime = true
		this.it = 0
		this.loadingTextArr = [
			'Loading...',
			'Loading ..',
			'Loading  .',
			'Loading   ',
			'Loading.  ',
			'Loading.. '
		]
	}

	_exit() {
		input.unregister('keydown', 'loadingKeydown')
		updater.unregister('loadingUpdate')
		animator.kill('loadingAnimation')
		for (let o = 0; o < this.on.length; o++) {
			this.on[o].off()
		}
		this.on = []
		route(cache.META_DATA.exitRoute)
	}

	keydown(event) {
		console.log('loadingKeydown', event)
	}

	componentDidMount() {
		dispatch.send('fadeOutBS')
		if (!cache.META_DATA.manifest ||
			!cache.META_DATA.exitRoute) {
				throw `Initial loading loop flaw`
		}
		if (cache.SVGS.loadedSVGs) {
			// all subbsequent loading loops should show an animated loading screen
			let svg = cache.SVGS.loadedSVGs.loadingCircle['1']
			this.state = {
				loadingCircle: {
					svg: svg,
					width: '200px',
					right: '50px',
					bottom: '50px',
					rotation: 0
				}
			}
			animator.play({
				svg: svg,
				name: 'loadingAnimation',
				type: 'loop'
			})
		}
		loaderWorker.postMessage({ msg: 'load', data: cache.META_DATA.manifest })
	}

	update(dt) {
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
			if (this.it >= this.loadingTextArr.length) this.it = 0
			this.deltaTime = 0
		}
	}

	loadingComplete(SVGS) {
		console.log('Loading Completed')
		cache.SVGS = SVGS
		dispatch.send('fadeInBS', this._exit)
	}

	render({}, { loadingText, loadingCircle }) {
		return (
			<div class={style.loading}>
				{
					loadingCircle &&
					<div class={style.stage}>
						<SVGWrap
							origin={{x:0, y:0}}
							right={loadingCircle.right}
							bottom={loadingCircle.bottom}
							width={loadingCircle.width}
							rotation={loadingCircle.rotation}
						>
							{loadingCircle.svg}
						</SVGWrap>
					</div>
				}
				<div class={style.effects}>
					<p>{loadingText}</p>
				</div>
			</div>
		)
	}
}