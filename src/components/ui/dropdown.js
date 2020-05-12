import { h, Component } from 'preact'
import style from './dropdown.css'
import classnames from 'classnames'
import Icon from 'components/ui/icon'
import TrinagleIcon from 'icons/triangle.svg'

class DropDown extends Component {
	componentDidMount() {
		this.state = {
			showChildren: !!this.props.show
		}
	}

	toggleDropDown = () => {
		let { showChildren } = this.state;
		this.setState({
			showChildren: !showChildren
		})
	}

	render({
		label,
		class: aClass,
		show,
		children
	},{
		showChildren
	}) {
		return (
			<ts-dropdown
				class={classnames(aClass, showChildren ? style.openAnim : style.closeAnim )}
				onClick={this.toggleDropDown}
			>
				{ label }
				<Icon
					image={TrinagleIcon}
					class={style.icon}
				/>
				{
					showChildren && 
					<ts-dropdown-children>
						{ children }
					</ts-dropdown-children>
				}
			</ts-dropdown>
		)
	}
}

export default DropDown
