import dispatch from 'util/data/dispatch'
import cache from 'util/data/cache'
import input from 'util/game/input'
import audio from 'util/game/audio'

export function componentDidMount() {
	input.register(
		'keydown',
		'settingsKeydown',
		this.keydown,
		this
	)
	let {
		volumeLevel,
		isMute
	} = cache.USER_PREFERENCES.audio
	this.setState({
		volumeLevel,
		isMute
	})
}

export function componentWillUnmount() {
	input.unregister('keydown', 'settingsKeydown')
}

export function cancel() {
	dispatch.send('route', '/mainmenu')
}

export function save() {
	console.log('save')
	debugger
	// cache.USER_PREFERENCES = {
	// 	...this.state
	// }
}

export function toggleMute() {
	let isMute = audio.toggleMute()
	this.setState({
		isMute
	})
	let { musicPlaying } = this.state
	if (!musicPlaying) {
		this.playMusic()
	}
}

export function volumeUpdate() {
	console.log('volumeUpdate')
}

export function keydown(event) {
	console.log('settingsKeydown', event)
}