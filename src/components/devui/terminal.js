import { h } from 'preact'
import style from './terminal.css'

const Terminal = () => (
	<div class={ style.terminal } >
		<div class={ style.output } >
			output
		</div>
		<input class={ style.input }
			placeholder={ 'input' }
		/>
	</div>
)

export default Terminal
