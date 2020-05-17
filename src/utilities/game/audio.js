import cache from 'util/data/cache'
import updater from 'util/game/updater'
import { intParse } from 'util/data/helpers'
import dispatch from 'util/data/dispatch'
import { Howl, Howler } from 'howler'


class Audio {
	constructor(parameters) {
		this.musics = []
		this.musicsById = {}

		this.sfxs = []
		this.sfxsById = {}

		this.speeches = []
		this.speechesById = {}

		this.isMute = true
	}

	toggleMute() {
		this.isMute = !this.isMute
		cache.USER_PREFERENCES.audio.isMute = this.isMute
		Howler.mute(this.isMute)
		return this.isMute
	}

	setVolume() {}

	play(id, type, loop) {
		let sound = new Howl({
			src: [id],
			html5: true
		})
		sound.howlId = sound.play()
		sound.on('end', function(){
			console.log('sound finished', id)
		})
		if (type === 'music') {
			this.musics.push(this.musicsById[id] = sound)
		}
		else if (type === 'sfx') {
			this.sfxs.push(this.sfxsById[id] = sound)
		}
		else if (type === 'speeches') {
			this.speeches.push(this.speechesById[id] = sound)
		}
		return sound;
	}

	stop() {}

	resume() {}

	restart() {}

}

export default new Audio
