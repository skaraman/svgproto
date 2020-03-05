const mainMenuScene = {
	objects: {
		// loadingCircle: {
		// 	1: 'loading/l1',
		// 	2: 'loading/l2',
		// 	3: 'loading/l3',
		// 	4: 'loading/l4',
		// 	5: 'loading/l5',
		// 	6: 'loading/l6',
		// 	7: 'loading/l7',
		// 	8: 'loading/l8',
		// 	9: 'loading/l9',
		// 	10: 'loading/l10',
		// 	11: 'loading/l11',
		// 	12: 'loading/l12',
		// 	13: 'loading/l13',
		// 	14: 'loading/l14',
		// 	15: 'loading/l15',
		// 	16: 'loading/l16'
		// },
		colorChar: {
			stand: 'fillers/colorChar/stand',
			bend1: 'fillers/colorChar/bend1',
			bend3: 'fillers/colorChar/bend3',
			bend2: 'fillers/colorChar/bend2',
		}
	},
	animations: {
		// loadingCircle: {
		// 	loadingAnimation: [{
		// 			from: 1,
		// 			to: 2,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 2,
		// 			to: 3,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 3,
		// 			to: 4,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 4,
		// 			to: 5,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 5,
		// 			to: 6,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 6,
		// 			to: 7,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 7,
		// 			to: 8,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 8,
		// 			to: 9,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 9,
		// 			to: 10,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 10,
		// 			to: 11,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 11,
		// 			to: 12,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 12,
		// 			to: 13,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 13,
		// 			to: 14,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 14,
		// 			to: 15,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 15,
		// 			to: 16,
		// 			fps: 15
		// 		},
		// 		{
		// 			from: 16,
		// 			to: 1,
		// 			fps: 15
		// 		}
		// 	]
		// },

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

export default mainMenuScene
