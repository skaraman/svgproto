import { h, Component } from 'preact'
import { route } from 'preact-router'
import style from './loading.css'

import input from 'util/input'
import updater from 'util/updater'
import loader from 'util/loader'
import dispatch from 'util/dispatch'
import animator from 'util/animator'
import cache from 'util/cache'

import SVGWrap from 'components/game/svgwrap'

export default class Loading extends Component {
  constructor(props) {
    super(props)
    input.register('keydown', 'loadingKeydown', this.keydown, this)
    updater.register('loadingUpdate', this.update, this)
    this.on = [
      dispatch.on('loadingComplete', this.loadingComplete, this)
    ]
    this._setAnimationState = this._setAnimationState.bind(this)
    this.deltaTime = 0
    this.notRealTime = true
    this.it = 0
    this.loadingTextArr = [
      'Loading...',
      'Loading ..',
      'Loading   .',
      'Loading   ',
      'Loading.  ',
      'Loading.. '
    ]
  }

  _exit() {
    input.unregister('keydown', 'loadingKeydown')
    updater.unregister('loadingUpdate')
    animator.kill('loadingAnimation')
    for (let o = 0; o < this.on.length; o++) {
      this.on[o].off()
    }
    this.on = []
  }

  keydown(event) {
    console.log('loadingKeydown', event)
  }

  componentWillMount() {
    if (!cache.SVGS.loadedSVGs.loadingCircle) {
      return
    }
    this.setState({
      loadingCircle: {
        svg: cache.SVGS.loadedSVGs.loadingCircle['1'],
        width: '200px',
        right: '50px',
        bottom: '50px',
        rotation: 0
      }
    })
  }

  componentDidMount() {
    dispatch.send('fadeOutBS')
    if (cache.META_DATA.manifest && cache.META_DATA.exitRoute) {
      if (this.state.loadingCircle)
        animator.play({
          svg: this.state.loadingCircle.svg,
          stateCallback: this._setAnimationState,
          name: 'loadingAnimation',
          type: 'loop'
        })
      loader.load(cache.META_DATA.manifest)
    }
  }

  _setAnimationState(svg) {
    let stateSvg = this.state[svg.id]
    this.setState({
      [svg.id]: {
        ...stateSvg,
        svg
      }
    })
  }

  update(dt) {
    if (this.notRealTime) {
      if (dt > 16) {
        dt = 16
      }
    }
    this.deltaTime += dt
    if (this.deltaTime > 500) {
      let loadingText = this.loadingTextArr[this.it]
      this.setState({
        loadingText
      })
      this.it++
      if (this.it >= this.loadingTextArr.length) this.it = 0
      this.deltaTime = 0
    }
  }

  loadingComplete() {
    console.log('Loading Completed')
    dispatch.send('fadeInBS', () => {
      this._exit()
      route(cache.META_DATA.exitRoute)
    })
  }

  render({}, { loadingText, loadingCircle }) {
    return (
      <div class={style.loading}>
        {
          loadingCircle &&
          <div class={style.stage}>
            <SVGWrap
              right={loadingCircle.right}
              bottom={loadingCircle.bottom}
              width={loadingCircle.width}
              rotation={loadingCircle.rotation}
            >
              {loadingCircle.svg}
            </SVGWrap>
          </div>
        }
        <div class={style.effects}>
          <p>{loadingText}</p>
        </div>
      </div>
    )
  }
}