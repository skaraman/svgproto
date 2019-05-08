import { h, Component } from 'preact'
import style from './pocademo.css'

import cache from 'util/cache'
import dispatch from 'util/dispatch'
import updater from 'util/updater'
import input from 'util/input'
import animator from 'util/animator'

import SVGWrap from 'components/game/svgwrap'
import Button from 'components/ui/button'

export default class TestScene extends Component {
  constructor(props) {
    super(props)
    cache.GAME_DATA.pocademo = cache.GAME_DATA.pocademo || {}
    updater.register('pocaDemoUpdate', this.update, this)
    this.deltaTime = 0
    input.register('keydown', 'pocaDemoKeyDown', this.keydown, this)
    input.register('keyup', 'pocaDemoKeyUp', this.keyup, this)
    this._setAnimationState = this._setAnimationState.bind(this)

  }

  keydown(event) {
    console.log('pocaDemoKeyDown', event)
    switch (event.code) {
    case 'KeyD':
      animator.play(this.state.poca.svg, this._setAnimationState, 'fullTurn', 'regular')
      break;
      // case 'KeyF':
      //   animator.play(this.state.poca.svg, this._setAnimationState, 'rightPunch', 'regular')
      //   break;
    }
  }
  keyup(event) {
    console.log('pocaDemoKeyUp', event)

  }

  update(dt) {
    // if (!this.timer) return
    // this.deltaTime += dt
    // if (this.deltaTime > 1000) this.updateTime()

  }

  _setAnimationState(svg, fitToSize) {
    let stateSvg = this.state[svg.id]
    let width = stateSvg.width
    let top = stateSvg.top
    if (fitToSize) {
      let viewBox = svg.attributes.viewBox.split(' ')
      let oldViewBox = svg.attributes.oldViewBox.split(' ')
      let newViewBoxHeight = viewBox[3] * 1
      let newViewBoxWidth = viewBox[2] * 1
      let oldViewBoxWidth = oldViewBox[2] * 1
      let oldViewBoxHeight = oldViewBox[3] * 1
      let oldWidth = stateSvg.width.replace('px', '') * 1
      let oldHeight = Math.trunc(((oldViewBoxHeight * oldWidth) / oldViewBoxWidth) * 100) / 100
      width = (newViewBoxWidth * oldWidth) / oldViewBoxWidth + 'px'
      let height = (newViewBoxHeight * oldHeight) / oldViewBoxHeight
      let hDiff = height - oldHeight
      top = (top.replace('px', '') * 1) - hDiff
      top = top + 'px'
    }
    this.setState({
      [svg.id]: {
        ...stateSvg,
        svg,
        width,
        top
      }
    })
  }

  componentWillMount() {
    this.setState({
      poca: {
        svg: cache.SVGS.loadedSVGs.poca.full_1,
        width: '500px',
        left: '10px',
        top: '100px',
        rotation: 0
      }
    })
    animator.setStaticFrame(this.state.poca.svg, this._setAnimationState, 'full_1')
    // TODO: move poca to 'GROUND_LEVEL'
    // // TODO:  add basic collision detection
  }

  // gets called when this route is navigated to
  componentDidMount() {
    dispatch.send('fadeOutBS')
  }

  // gets called just before navigating away from the route
  componentWillUnmount() {
    updater.unregister('pocaDemoUpdate')
  }

  playFrame(from, to) {

  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ user }, { time, count, poca }) {
    return (
      <div class={style.scene}>
        {
          poca &&
          <div class={style.stage}>
            <SVGWrap
              left={poca.left}
              top={poca.top}
              width={poca.width}
              rotation={poca.rotation}
            >
              {poca.svg}
            </SVGWrap>
          </div>
        }
        <div class={style.effects}>
          <div class={style.frameButtons}>
            <Button
              text='1 to 2'
              onClick={() => this.playFrame(1, 2)}
            />
            <Button
              text='2 to 3'
              onClick={() => this.playFrame(2, 3)}
            />
            <Button
              text='3 to 4'
              onClick={() => this.playFrame(3, 4)}
            />
            <Button
              text='4 to 5'
              onClick={() => this.playFrame(4, 5)}
            />
            <Button
              text='5 to 6'
              onClick={() => this.playFrame(5, 6)}
            />
            <Button
              text='6 to 7'
              onClick={() => this.playFrame(6, 7)}
            />
          </div>
        </div>
      </div>
    )
  }
}
