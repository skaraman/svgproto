import { h } from 'preact'
import style from './stage.css'

import hierarchy from 'util/hierarchy'

const Stage = ({ data }) => {
  debugger
  return (
    <svg class={style.stage}>
      {
        for (let d in data)
        let v = data[d]
          v.svg

      }
    </svg>
  )
}
export default Stage
