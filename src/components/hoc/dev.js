import cache from 'util/data/cache'

export default function dev(target) {
	if (target.prototype && target.prototype.componentDidMount) {
		target.prototype.oldComponentDidMount = target.prototype.componentDidMount;
		target.prototype.componentDidMount = componentDidMount;
	}
}

function componentDidMount() {
	let { isDev } = cache.META_DATA
	isDev && this.setState({ isDev })
	this.oldComponentDidMount && this.oldComponentDidMount();
}
