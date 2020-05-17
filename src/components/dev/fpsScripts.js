import { intParse, isDefined } from 'util/data/helpers'
import cache from 'util/data/cache'
import updater from 'util/game/updater'

const second = 1000
const limiter = 2

export function initMeter() {
	updater.register(
		'fpsmeter',
		this.update,
		this
	)
	this.updateDisplayFPS()
}

export function destroyMeter() {
	updater.unregister('fpsmeter')
}

export function update(dt) {
	let { fps, updateTime } = this.state
	if (!isDefined(fps) || !isDefined(updateTime)) {
		return
	}
	fps++
	updateTime += dt
	this.setState({
		fps,
		updateTime
	})
	if (updateTime >= second * limiter) {
		this.updateDisplayFPS(fps)
	}
}

export function updateDisplayFPS(fps) {
	this.setState({
		displayFPS: intParse(fps / limiter),
		fps: 0,
		updateTime: 0
	})
}

export function initOptions() {
	let { isPaused = false } = cache.META_DATA
	this.setState({
		paused: isPaused
	})
	updater.toggle(!isPaused)
}

export function pauseToggle(event) {
	event.stopPropagation()
	let { paused } = this.state
	updater.toggle(!!paused)
	this.setState({
		paused: !paused
	})
	cache.META_DATA.isPaused = !paused
}

export function step(event) {
	event.stopPropagation()
	updater.step()
}
