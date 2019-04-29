import { h, Component } from 'preact'
import style from './mainmenu.css'
import { route } from 'preact-router'

import animator from 'util/animator'
import cache from 'util/cache'
import input from 'util/input'
import dispatch from 'util/dispatch'
import updater from 'util/updater'

import Button from 'components/ui/button'
import SVGWrap from 'components/game/svgwrap'

export default class MainMenu extends Component {
    constructor(props) {
        super(props)
        input.register('keydown', 'mainMenuKeydown', this.keydown, this)
        this.play = this.play.bind(this)
        this.testscene = this.testscene.bind(this)
        this.settings = this.settings.bind(this)
        this._setAnimationState = this._setAnimationState.bind(this)
        updater.register('mainMenuUpdate', this.update, this)
        this.deltaTime = 0
    }

    _exit() {
        updater.unregister('mainMenuUpdate')
        input.unregister('keydown', 'mainMenuKeydown')
    }

    keydown(event) {
        console.log('mainMenuKeydown', event)
    }

    play(event) {
        event.stopPropagation()
        animator.playAnimation(this.state.box, this._setAnimationState)
        this.playMotions = true
        // // TODO: remove entity from scene, possibly send over state callback?
        // dispatch.send('saveEntity', 'mainMenuBox', this.state.box)
    }

    settings() {
        this._exit()
        route('/settings')
    }

    testscene() {
        cache.META_DATA.exitRoute = '/testscene'
        cache.META_DATA.manifest = 'testScene'
        dispatch.send('fadeInBS', () => {
            this._exit()
            route('/')
        })
    }

    update(dt) {
        if (this.playMotions) {
            this.deltaTime += (dt / 4)
            let width, x, y, rotation
            width = ((this.deltaTime % 3000)) % 400
            x = ((this.deltaTime % 9000) / 9) % 500
            y = ((this.deltaTime % 9000) / 12) % 200
            rotation = (this.deltaTime % 1440) / 4
            this.setState({
                width,
                x,
                y,
                rotation
            })
        }
    }

    _setAnimationState(svg) {
        this.setState({
            box: svg
        })
    }

    componentWillMount() {
        dispatch.send('fadeOutBS')
        this.setState({
            box: cache.SVGS.loadedSVGs.testObject.box,
            width: 300,
            x: 0,
            y: 0,
            rotation: 0
        })
        animator.setStaticFrame(this.state.box, this._setAnimationState)
    }

    render({}, { box, x, y, width, rotation }) {
        return (
            <div class={style.mainWrap}>
                <div class={style.mainMenu}>
                    <div class={style.mainMenuText}>Main Menu</div>
                    <Button
                        text='Start Game'
                        onClick={this.testscene}
                    />
                    <Button
                        text='Settings'
                        onClick={this.settings}
                    />
                    <Button
                        text='Play Test Animation'
                        onClick={this.play}
                    />
                    <p>copyright and trademark stuff</p>
                </div>
                {
                    box &&
                    <div class={style.stage}>
                        <SVGWrap x={x} y={y} width={width} rotation={rotation}>
                            {box}
                        </SVGWrap>
                    </div>
                }
            </div>
        )
    }
}