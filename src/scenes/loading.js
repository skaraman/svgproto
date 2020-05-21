import { h, Component, Fragment } from 'preact'
import style from './loading.css'
import { bindAll } from 'util/data/helpers'
import webglstage from 'components/game/stage'
import dev from 'components/hoc/dev'
import {
	initilize,
	update,
	loadingComplete,
	loadingProgress,
	fsReady,
	keydown,
	attemptLoadingDone,
	exit
} from './loadingScripts'

@dev
export default class Loading extends Component {
	constructor(props) {
		super(props)
		bindAll(this, [
			initilize,
			update,
			loadingComplete,
			loadingProgress,
			fsReady,
			keydown,
			attemptLoadingDone,
			exit
		])
	}

	componentDidMount() {
		this.initilize()
	}

	componentWillUnmount() {
		this.exit()
	}

	render({}, {
		loadingText,
		entities,
		progress,
		total
	}) {
		return (
			<ts-loading>
				{
					entities &&
					<WebglStage class={ style.stage } >
						{ entities }
					</WebglStage>
				}
				<ts-effects>
					<ts-text>{loadingText}</ts-text>
					<ts-text>{progress} / {total}</ts-text>
				</ts-effects>
			</ts-loading>
		)
	}
}
