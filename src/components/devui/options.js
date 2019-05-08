import { h, Component } from 'preact'
import style from './options.css'

import updater from 'util/updater'

import Button from 'components/ui/button'

export default class Options extends Component {
  constructor(props) {
    super(props)
    this._play = true
    this.pause = this.pause.bind(this)
    this.step = this.step.bind(this)
  }

  pause() {
    this._play = !this._play
    updater.toggle(this._play)
  }

  step() {
    updater.step()
  }

  render({}, {}) {
    return (
      <div class={style.options}>
        <input type="checkbox" id="pause" onClick={this.pause} /> Pause
        <Button text="step" onClick={this.step} />
      </div>
    )
  }
}