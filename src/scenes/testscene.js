import { h, Component } from 'preact'
import style from './testscene.css'

import cache from 'util/cache'
import dispatch from 'util/dispatch'
import updater from 'util/updater'
import input from 'util/input'
import animator from 'util/animator'

import Stage from 'components/game/stage'

export default class TestScene extends Component {
  constructor(props) {
    super(props)
    this.updateTime = this.updateTime.bind(this)
    this.increment = this.increment.bind(this)
    cache.GAME_DATA.testscene = cache.GAME_DATA.testscene || {}
    updater.register('testsceneUpdate', this.update, this)
    this.deltaTime = 0
    // TODO: rig up player input control
    // TODO: figure out mutltiple keystrokes at once
    input.register('keydown', 'testsceneKeydown', this.keydown, this)
    input.register('keyup', 'testsceneKeyup', this.keyup, this)
    // input.register('keypress', 'testsceneKeypress', this.keypress, this)
    this._setAnimationState = this._setAnimationState.bind(this)

  }

  keydown(event) {
    console.log('testsceneKeydown', event)
    switch (event.code) {
      case 'KeyD':
        animator.play({
          svg: this.state.esperanza.svg,
          stateCallback: this._setAnimationState,
          name: 'leftPunch',
          type: 'regular'
        })
        break;
      case 'KeyF':
        animator.play({
          svg: this.state.esperanza.svg,
          stateCallback: this._setAnimationState,
          name: 'rightPunch',
          type: 'regular'
        })
        break;
    }
  }
  keyup(event) {
    console.log('testsceneKeyup', event)

  }
  // keypress(event) {
  //     console.log('testsceneKeypress', event)
  // }
  // update the current time
  updateTime() {
    this.setState({
      time: Date.now()
    })
    this.deltaTime = 0
  }

  increment() {
    this.setState({
      count: cache.GAME_DATA.testscene.count = this.state.count + 1
    })
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
      esperanza: {
        svg: cache.SVGS.loadedSVGs.esperanza.stand,
        width: '500px',
        left: '10px',
        top: '100px',
        rotation: 0
      },
      test: {
        svg: cache.SVGS.loadedSVGs.testObject2.circle,
        width: '100px',
        left: '600px',
        top: '250px',
        rotation: 0
      },
      time: Date.now(),
      count: cache.GAME_DATA.testscene.count = cache.GAME_DATA.testscene.count || 10
    })
    animator.setStaticFrame(this.state.esperanza.svg, this._setAnimationState, 'stand')
    // TODO: move esperanza to 'GROUND_LEVEL'
    // // TODO:  add basic collision detection
  }

  // gets called when this route is navigated to
  componentDidMount() {
    // start a timer for the clock:
    this.timer = true
    dispatch.send('fadeOutBS')
  }

  // gets called just before navigating away from the route
  componentWillUnmount() {
    updater.unregister('testsceneUpdate')
  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ user }, { time, count, esperanza, test }) {
    let data = { esperanza, test }
    return (
      <div class={style.scene}>
        {
          (esperanza && test) &&
          <Stage class={style.stage}>
            {data}
          </Stage>
        }
        <div class={style.effects}>
          <h1>Profile: {user}</h1>
          <p>This is the user profile for a user named { user }.</p>
          <div>Current time: {new Date(time).toLocaleString()}</div>
          <p>
            <button onClick={this.increment}>Click Me</button>
            {' '}
            Clicked {count} times.
          </p>
        </div>
      </div>
    )
  }
}