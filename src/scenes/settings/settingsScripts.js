import { route } from 'preact-router'
import cache from 'util/data/cache'

export function cancel() {
	this.input.unregister('keydown', 'settingsKeydown')
	route('/mainmenu')
}

export function initilize() {
	let {
		volumeLevel,
		isMute
	} = cache.USER_PREFERENCES.audio
	this.setState({
		volumeLevel,
		isMute
	})
}
