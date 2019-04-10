import { h, Component } from 'preact'
import style from './style'

import Terminal from 'components/terminal'
import Button from 'components/ui/button'

import ReelData from 'data/reel'
import { interpolate } from 'flubber'

import Box from '!!preact-svg-loader!svg/test/box.svg'
import Star from '!!preact-svg-loader!svg/test/star.svg'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.svgsToRender = {
      box: Box({}),
      star: Star({})
    }
    this.reelData = ReelData
    // for character
    //     for animation
    //         for fromFrame
    //             bake timeframe frames to toFrame
  }

  componentWillMount() {
    console.log('componentWillMount')
  }

  componentDidMount() {
    console.log('componentDidMount')
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

  componentWillReceiveProps() {
    console.log('componentWillReceiveProps')
  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdate')
  }

  componentWillUpdate() {
    console.log('componentWillUpdate')
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
  }

  playClick() {
    console.log('playClick')
  }

  render({}, {}) {

    return (
      <div class={style.home}>
        <Button
          text='Play'
          onClick={this.playClick}
        />
        <p>There should be a SVG Box...</p>
        <Box />
        <Terminal />
      </div>
    )
  }
}