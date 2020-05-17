import { h, Component, toChildArray } from 'preact'
import cache from 'util/data/cache'
import dispatch from 'util/data/dispatch'

export default class Router extends Component {
	componentDidMount() {
		this.on = [
			dispatch.on('route', this._route, this)
		]
		this._onChange()
	}

	componentDidUpdate(prevProps) {
		if (this.props.currentPath && prevProps.currentPath !== this.props.currentPath) {
			this._onChange()
		}
	}

	_route = (path, srch = '') => {
		let { pathname, search = '' } = cache.LOCATION
		history.pushState(null, null, path + srch)
		cache.LOCATION = {
			pathname: path,
			search: srch
		}
		this._onChange(pathname + search)
	}

	_onChange = (previous) => {
		let { pathname, search = '' } = cache.LOCATION
		let children = toChildArray(this.props.children)
		let child
		for (let cdx of children) {
			if (cdx.props.path === pathname) {
				child = cdx;
				this.setState({
					child,
					path: pathname + search
				})
				break
			}
		}
		if (this.props.onChange) {
			this.props.onChange({
				search:  search,
				previous: previous || '',
				path: pathname
			})
		}
	}

	render({
	}, {
		child
	}) {
		return (
			<ts-router id='router' >
				{
					child
				}
			</ts-router>
		)
	}
}
