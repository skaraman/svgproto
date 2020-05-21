import { getNumAssets } from 'util/data/helpers'

let mainMenu = {
	objects: {
		colorChar: {
			stand: 'fillers/colorChar/stand',
			bend1: 'fillers/colorChar/bend1',
			bend2: 'fillers/colorChar/bend2',
			bend3: 'fillers/colorChar/bend3',
		},
		colorCharX: {
			stand: 'fillers/colorChar/stand',
			bend1: 'fillers/colorChar/bend1',
			bend2: 'fillers/colorChar/bend2',
			bend3: 'fillers/colorChar/bend3',
		}
	},
	animations: {
		colorChar: {
			powerUp: {
				type: 'animation',
				sequence: [{
						from: 'stand',
						to: 'bend1',
						frames: 30
					},
					{
						from: 'bend1',
						to: 'bend2',
						frames: 30
					},
					{
						from: 'bend2',
						to: 'bend3',
						frames: 30
					},
					{
						from: 'bend3',
						to: 'stand',
						frames: 30
					}
				]
			},
			spin: {
				type: 'tween',
				mode: 'rotate',
				sequence: [{
					from: 0,
					to: 360,
					time: 1000
				}]
			},
			scale: {
				type: 'tween',
				mode: 'scale',
				sequence: [{
						from: 1,
						to: 1.5,
						time: 1000
					},
					{
						from: 1.5,
						to: 0.5,
						time: 1000
					},
					{
						from: 0.5,
						to: 1.5,
						time: 1000
					}
				]
			}
		},
		colorCharX: {
			powerUp: {
				type: 'animation',
				sequence: [{
						from: 'stand',
						to: 'bend1',
						frames: 30
					},
					{
						from: 'bend1',
						to: 'bend2',
						frames: 30
					},
					{
						from: 'bend2',
						to: 'bend3',
						frames: 30
					},
					{
						from: 'bend3',
						to: 'stand',
						frames: 30
					}
				]
			}
		}
	},
	sounds: {
		musics: {
			main: '/assets/sounds/music/starcatcher.mp3'
		}
	}
}

mainMenu.loaderAssets = getNumAssets(mainMenu) // num of object svgs and total fps between sequences
console.log(mainMenu.loaderAssets)

export default mainMenu
