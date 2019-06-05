import { h, Component } from 'preact'
import style from './donotdestroy.css'

import dispatch from 'util/dispatch'
import cache from 'util/cache'

import SVGWrap from 'components/ui/svgwrap'

export default class DoNotDestroy extends Component {
  constructor(props) {
    super(props)
    this._play = true
    this.entities = []
    this.on = [
            dispatch.on('saveEntity', this.save, this)
        ]
  }

  save(id, entity) {
    this.entities.push(entity)
    this.setState({
      entities: this.entities
    })
  }

  // load() {
  //     for (let i = 0; i < this.entities.length: i++) {
  //         this.entities[i]
  //     }
  // }


  render({}, { entities }) {
    return (
      <div class={style.donotdestroy}>
        {
          entities &&
          entities.map((v) => (
            <SVGWrap width={300}>
              {v}
            </SVGWrap>
          ))
        }
      </div>
    )
  }
}