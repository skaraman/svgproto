import { h, Component } from 'preact'
import style from './stage.css'

import hierarchy from 'util/hierarchy'

export default class Stage extends Component {
  constructor(props) {
    super(props)
    this.initialRender = false
  }

  _setState() {
    let paths = hierarchy.getPaths()
    let grads = hierarchy.getGrads()
    this.setState({
      paths,
      grads
    })
  }

  componentWillReceiveProps(props, context) {
    hierarchy.update(svgs)
    this._setState()
  }

  render({ children }, { paths, grads }) {
    if (this.initialRender === false) {
      hierarchy.add(children[0])
      this._setState()
      this.initialRender = true
      return
    }
    return (
      <div class={style.stage}>
        <svg class={style.svgStage}>
          {
            grads.map( (v) => {
              return (
                <linearGradient
                  gradientUnits={v.attributes.gradientUnits}
                  id={v.attributes.id}
                  x1={v.attributes.x1}
                  x2={v.attributes.x2}
                  y1={v.attributes.y1}
                  y2={v.attributes.y2}
                >
                  <stop
                    offset={v.children[0].attributes.offset}
                    stop-color={v.children[0].attributes['stop-color']}
                  />
                  <stop
                    offset={v.children[1].attributes.offset}
                    stop-color={v.children[1].attributes['stop-color']}
                  />
                </linearGradient>
              )
            })
          }
          {
            paths.map( (v) => {
              return (
                <path
                  d={v.attributes.d}
                  fill={v.attributes.fill}
                />
              )
            })
          }
        </svg>
      </div>
    )
  }
}