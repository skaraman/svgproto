import input from 'util/game/input'
import { isNaZN } from 'util/data/helpers'
import { setTheme } from 'components/app'
import style from './ui.css'
import cache from 'util/data/cache'

export function toggleView(event) {
	event.stopPropagation()
	let {
		xPos,
		yPos,
		animation
	} = this.state;
	if (isNaZN(xPos) || isNaZN(yPos)) {
		this.setState({
			xPos: 0,
			yPos: 0
		})
		return
	}
	if (animation === style.openAnim) {
		this.setState({
			animation: style.closeAnim
		})
	}
	else {
		this.setState({
			animation: style.openAnim
		})
	}
}

export function switchTheme(event) {
	if (cache.THEME._current === cache.THEME.basic) {
		cache.THEME._current = cache.THEME.alternate
	}
	else {
		cache.THEME._current = cache.THEME.basic
	}
	setTheme(cache.THEME._current)
}


export function navHome() {

}

export function navMainMenu() {

}

export function navDemo() {

}
