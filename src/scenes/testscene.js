import { h, Component } from 'preact'
import style from './testscene.css'

import cache from 'util/cache'
import dispatch from 'util/dispatch'
import updater from 'util/updater'
import input from 'util/input'

import SVGWrap from 'components/game/svgwrap'

export default class TestScene extends Component {
    constructor(props) {
        super(props)
        this.updateTime = this.updateTime.bind(this)
        this.increment = this.increment.bind(this)
        this.sceneCache = cache.GAME_DATA.testscene = cache.GAME_DATA.testscene || {}
        this.svgCache = cache.SVGS
        updater.register('testsceneUpdate', this.update, this)
        this.deltaTime = 0
        // TODO: rig up player input control
        // TODO: figure out mutltiple keystrokes at once
        input.register('keydown', 'testsceneKeydown', this.keydown, this)
    }

    keydown(event) {
        console.log('testsceneKeydown', event)
    }
    // update the current time
    updateTime() {
        this.setState({
            time: Date.now()
        })
        this.deltaTime = 0
    }

    increment() {
        this.setState({
            count: this.sceneCache.count = this.state.count + 1
        })
    }

    update(dt) {
        if (!this.timer) return
        this.deltaTime += dt
        if (this.deltaTime > 1000) this.updateTime()

    }

    componentWillMount() {
        this.setState({
            esperanza: {
                svg: this.svgCache.loadedSVGs.esperanza.stand,
                width: 250,
                y: 400,
                x: 400,
                rotation: 0
            },
            time: Date.now(),
            count: this.sceneCache.count = this.sceneCache.count || 10
        })
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
    render({ user }, { time, count, esperanza }) {
        return (
            <div class={style.scene}>
                {
                    esperanza &&
                    <div class={style.stage}>
                        <SVGWrap
                            x={esperanza.x}
                            y={esperanza.y}
                            width={esperanza.width}
                            rotation={esperanza.rotation}
                        >
                            {esperanza.svg}
                        </SVGWrap>
                    </div>
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