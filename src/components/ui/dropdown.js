import { h, Component } from 'preact'
import style from './dropdown.css'
import classnames from 'classnames'
import Icon from 'components/ui/icon'
import CaretIcon from 'icons/caret.svg'

class DropDown extends Component {
	componentDidMount() {
		this.state = {
			showChildren: !!this.props.show
		}
	}

	toggleDropDown = (event) => {
		event.stopPropagation()
		let { showChildren } = this.state
		this.setState({
			showChildren: !showChildren
		})
	}

	render({
		label,
		class: aClass,
		children,
		useIcon = true
	},{
		showChildren
	}) {
		return (
			<ts-dropdown
				class={classnames(
					aClass,
					showChildren ? style.openAnim : style.closeAnim
				)}
				onMouseUp={ this.toggleDropDown }
				onMouseDown={event=>event.stopPropagation()}
			>
				{ label }
				{ useIcon &&
					<Icon class={style.icon}>
						<CaretIcon/>
					</Icon>
				}
				{ showChildren &&
					<ts-dropdown-children>
						{ children }
					</ts-dropdown-children>
				}
			</ts-dropdown>
		)
	}
}

export default DropDown
