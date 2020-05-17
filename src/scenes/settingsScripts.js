import dispatch from 'util/data/dispatch'
import cache from 'util/data/cache'
import input from 'util/game/input'
import audio from 'util/game/audio'


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

export function toggleMute() {
	let isMute = audio.toggleMute()
	this.setState({
		isMute
	})
	let { musicPlaying } = this.state
	if (!musicPlaying){
		this.playMusic()
	}
}

export function volumeUpdate() {
	console.log('volumeUpdate')
}
