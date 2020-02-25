import { h, Component } from 'preact'
import style from './settings.css'
import { route } from 'preact-router'
import cache from 'util/cache'
import input from 'util/input'

import Button from 'components/ui/button'
import SVGWrap from 'components/ui/svgwrap'

export default class MainMenu extends Component {
	constructor(props) {
		super(props)
		input.register('keydown', 'settingsKeydown', this.keydown, this)
		this.cancel = this.cancel.bind(this)
	}

	keydown(event) {
		console.log('settingsKeydown', event)
	}

	cancel() {
		input.unregister('keydown', 'settingsKeydown')
		route('/mainmenu')
	}

	render({}, {}) {
		return (
			<div class={style.settingsWrap}>
				<div class={style.settings}>
					<div class={style.settingsText}>Settings</div>
					<div>Keybindings</div>
					<Button
						text='Cancel'
						onClick={this.cancel}
					/>
					<p>copyright and trademark stuff</p>
				</div>
			</div>
		)
	}
}
