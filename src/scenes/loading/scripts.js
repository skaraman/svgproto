export function initilize(statics) {
	if (statics && statics.loadingCircle) {
		// all subbsequent loading loops should show an animated loading screen
		let entity = statics.loadingCircle['1']
		this.state = {
			actors: {
				loadingCircle: {
					entity,
					width: '200px',
					right: '50px',
					bottom: '50px',
					rotation: 0
				}
			}
		}
		animator.play({
			entityId: 'loadingCircle',
			name: 'loadingAnimation',
			type: 'loop'
		})
	}
}
