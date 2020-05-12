const mainMenu = {
	objects: {
		colorChar: {
			stand: 'fillers/colorChar/stand',
			bend1: 'fillers/colorChar/bend1',
			bend3: 'fillers/colorChar/bend3',
			bend2: 'fillers/colorChar/bend2',
		}
	},
	animations: {
		colorChar: {
			powerUp: {
				type: 'animation',
				sequence: [{
						from: 'stand',
						to: 'bend1',
						fps: 60
					},
					{
						from: 'bend1',
						to: 'bend2',
						fps: 60
					},
					{
						from: 'bend2',
						to: 'bend3',
						fps: 60
					},
					{
						from: 'bend3',
						to: 'stand',
						fps: 60
					}
				]
			},
			spin: {
				type: 'tween',
				mode: 'rotate',
				sequence: [{
					from: 0,
					to: 360,
					fps: 60
				}]
			},
			scale: {
				type: 'tween',
				mode: 'scale',
				sequence: [{
						from: 1,
						to: 1.5,
						fps: 60
					},
					{
						from: 1.5,
						to: 0.5,
						fps: 60
					},
					{
						from: 0.5,
						to: 1.5,
						fps: 60
					}
				]
			}
		}
	}
}

export default mainMenu
