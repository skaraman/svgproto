import dispatch from 'util/data/dispatch'
import cache from 'util/data/cache'
import input from 'util/game/input'


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


export function cancel() {
	input.unregister('keydown', 'settingsKeydown')
	dispatch.send('route', '/mainmenu')
}


export function save() {

}
