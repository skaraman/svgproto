import {h, Component} from 'preact'
import * as Three from 'three'
import Button from 'components/ui/button'
import style from './webglstage.css'
import hierarchy from 'util/game/hierarchy'
import cache from 'util/data/cache'
import dev from 'components/hoc/dev'
import animator from 'util/game/animator'
import { createMesh } from 'util/data/helpers'

//const tweenr = Tweenr({ defaultEase: 'expoOut' })

class ThreeStage extends Component {
	scene = new Three.Scene()
	renderer = new Three.WebGLRenderer({
		antialias: true,
		alpha: true,
		devicePixelRatio: window.devicePixelRatio
	})

	componentDidMount() {
		animator.setStageCallback(this.updateStageFromAnimation)
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.dom.appendChild(this.renderer.domElement)
		this.create()
		this.update()
		hierarchy.addMeshes(cache.SVGS.statics)
		this.updateStage()
	}

	componentWillReceiveProps(props) {
		if (props.zoom !== this.props.zoom) {
			this.camera.fov = props.zoom
			this.camera.updateProjectionMatrix()
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.children !== prevProps.children) {
			hierarchy.update(this.props.children)
		}
		//this.updateStage()
	}

	updateStage = () => {
		let ents = hierarchy.getEntitiesById()
		this.setState({
			ents
		})
		this.add(ents)
	}

	add = (meshes) => {
		for (let cdx in meshes) {
			let character = meshes[cdx]
			for (let sdx in character) {
				if (sdx !== 'stand') {
					continue
				}
				let statik = character[sdx]
				for (let pdx in statik.paths) {
					let path = statik.paths[pdx]
					path.viewBox = statik.viewBox
					let grad = statik.grads[cdx + '_' + pdx]
					let mesh = createMesh(path, grad)
					
					this.scene.add(mesh)
				}
			}
		}
	}

	create = () => {
		const size = window.innerWidth / window.innerHeight
		this.camera = new Three.PerspectiveCamera(
			this.props.zoom,
			size,
			0.1,
			1000
		)
		this.camera.position.z = 5
		this.renderer.setClearColor(0x2c3e50, 1)
		console.log('Created a path:', this.path)
		this.renderer.render(this.scene, this.camera)

	}

	update = () => {
		requestAnimationFrame(this.update)
		// this.path.rotation.x += 0.01
		// console.log(this.path.rotation)
		// // this.path.rotation.y += 0.1
		// // this.path.translateZ(0.05)
		// // this.path.translateX(0.01)
		this.renderer.render(this.scene, this.camera)
	}

	updateStageFromAnimation = (svg) => {
		let stateSvg = this.state[svg.id]
		this.setState({
			[svg.id]: {
				...stateSvg,
				svg
			}
		})
	}

	ref = r => {
		this.dom = r
	}

	render = () => (
		<div ref={this.ref} />
	)
}

@dev
export default class Stage extends Component {
	state = { zoom: 50 }

	zoomIn = () => this.state.zoom >= 0 && this.setState({
		zoom: this.state.zoom - 5
	})
	zoomOut = () => this.state.zoom <= 95 && this.setState({
		zoom: this.state.zoom + 5
	})

	render = (props, {zoom}) => (
		<ts-stage>
			<ThreeStage zoom={ zoom } />
			<Button
				text={ 'Zoom In' }
				onMouseUp={ this.zoomIn }
			/>
			<Button
				text={ 'Zoom Out' }
				onMouseUp={ this.zoomOut }
			/>
		</ts-stage>
	)
}
