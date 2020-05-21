import * as rematrix from 'rematrix'
import * as Three from 'three'
import svgMesh3d from 'svg-mesh-3d'
const createGeometry = require('three-simplicial-complex')(Three)

export function intParse(value) {
	return ~~value
}

export function isDefined(value) {
	return value !== undefined && value !== null
}

export function isFunction(value) {
	return typeof value === 'function'
}

export function isNaZN(value) {
	return isDefined(value) && !isNaN(value) && (value > 0 || value < 0)
}

export function bindAll(ring, o) {
	for (let odx = 0; odx < o.length; odx++) {
		ring[o[odx].name] = function () {
			o[odx].apply(ring, [...arguments])
		}
	}
}

export function queryParams() {
	let sn = location.search.replace('?', '').split('&').map(sv => {
		let sp = sv.split('=')
		return { [sp[0]]: sp[1] }
	})
	let res = {}
	for (let sdx of sn) {
		Object.assign(res, sdx)
	}
	for (let rdx in res) {
		if (res[rdx] === 'true') {
			res[rdx] = true
		}
		else if (res[rdx] === 'false') {
			res[rdx] = false
		}
		else if (!isNaN(res[rdx])) {
			res[rdx] = res[rdx] * 1
		}
	}
	return res
}

export function boxUnwrapUVs(geometry) {
	for (var i = 0; i < geometry.faces.length; i++) {
			var face = geometry.faces[i];
			var faceUVs = geometry.faceVertexUvs[0][i] || [
				new Three.Vector2(),
				new Three.Vector2(),
				new Three.Vector2()
			]
			var va = geometry.vertices[geometry.faces[i].a]
			var vb = geometry.vertices[geometry.faces[i].b]
			var vc = geometry.vertices[geometry.faces[i].c]
			var vab = new Three.Vector3().copy(vb).sub(va)
			var vac = new Three.Vector3().copy(vc).sub(va)
			//now we have 2 vectors to get the cross product of...
			var vcross = new Three.Vector3().copy(vab).cross(vac);
			//Find the largest axis of the plane normal...
			vcross.set(Math.abs(vcross.x), Math.abs(vcross.y), Math.abs(vcross.z))
			var majorAxis = vcross.x > vcross.y ? (vcross.x > vcross.z ? 'x' : vcross.y > vcross.z ? 'y' : vcross.y > vcross.z) : vcross.y > vcross.z ? 'y' : 'z'
			//Take the other two axis from the largest axis
			var uAxis = majorAxis == 'x' ? 'y' : majorAxis == 'y' ? 'x' : 'x'
			var vAxis = majorAxis == 'x' ? 'z' : majorAxis == 'y' ? 'z' : 'y'
			faceUVs[0].set(va[uAxis], va[vAxis])
			faceUVs[1].set(vb[uAxis], vb[vAxis])
			faceUVs[2].set(vc[uAxis], vc[vAxis])
			geometry.faceVertexUvs[0][i] = faceUVs
	 }
	geometry.elementsNeedUpdate = geometry.uvsNeedUpdate = geometry.verticesNeedUpdate = true
}

export function arraysToUniqueObj() {
	if (!arguments) return null
	var output = {}
	for (let j = 0; j < arguments.length; j++) {
		let args = arguments[j]
		for (let i = 0; i < args.length; i++) {
			let newkey = args[i]
			if (!output[newkey]) {
				output[newkey] = newkey
			}
		}
	}
	return output
}

export function objectAssignAll(target, source) {
	for (let key in source) {
		let value = source[key]
		if (typeof value === 'object' && typeof target[key] === 'object') {
			value = objectAssignAll(target[key], value)
		}
		target[key] = value
	}
	return target
}

function _objectSpread(target) {
	for (let i = 1; i < arguments.length; i++) {
		let source = arguments[i] != null ? arguments[i] : {}
		if (i % 2) {
			ownKeys(Object(source), true).forEach(function (key) {
				_defineProperty(target, key, source[key])
			});
		} else if (Object.getOwnPropertyDescriptors) {
			Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
		} else {
			ownKeys(Object(source)).forEach(function (key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
			})
		}
	}
	return target
}

// HEX color
export function lerpColor(color1, color2, amount) {
	if (!color1.startsWith('#') && !color2.startsWith('#')) {
		if (color1 === 'none' || color2 === 'none') return 'none'
		// console.log('use #HEXfmt', color1, color2)
		if (!color1.startsWith('#')) {
			color1 = colors[color1.toLowerCase()]
		}
		if (!color2.startsWith('#')) {
			color2 = colors[color2.toLowerCase()]
		}
	}
	if (color1.length === 4) {
		color1 += color1[3] + color1[3] + color1[3]
	}
	if (color2.length === 4) {
		color2 += color2[3] + color2[3] + color2[3]
	}
	if (amount === 0) return color1
	if (amount === 1) return color2
	if (color1 === color2) return color1
	var ah = +color1.replace('#', '0x'),
		ar = ah >> 16,
		ag = ah >> 8 & 0xff,
		ab = ah & 0xff,
		bh = +color2.replace('#', '0x'),
		br = bh >> 16,
		bg = bh >> 8 & 0xff,
		bb = bh & 0xff,
		rr = ar + amount * (br - ar),
		rg = ag + amount * (bg - ag),
		rb = ab + amount * (bb - ab)
	return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1)
}

// gradient
export function lerpGradient(grad1, grad2, amount, idmod = '') {
	if (!grad1.id || !grad2.id) {
		let grads = _fixGrads(grad1, grad2)
		grad1 = grads.grad1
		grad2 = grads.grad2
	}
	let x1 = ((grad2.x1 - grad1.x1) * amount) + (grad1.x1 * 1)
	let x2 = ((grad2.x2 - grad1.x2) * amount) + (grad1.x2 * 1)
	let y1 = ((grad2.y1 - grad1.y1) * amount) + (grad1.y1 * 1)
	let y2 = ((grad2.y2 - grad1.y2) * amount) + (grad1.y2 * 1)
	let id = grad1.id + (idmod ? '_' + idmod : '')
	let color1 = null
	if (grad1.colors[0]) color1 = lerpColor(
		grad1.colors[0].color || '#000000',
		grad2.colors[0].color || '#000000',
		amount
	)
	let color2 = null
	if (grad2.colors[1]) color2 = lerpColor(
		grad1.colors[1].color || '#000000',
		grad2.colors[1].color || '#000000',
		amount
	)
	let fillobj = {
		x1,
		x2,
		y1,
		y2,
		colors: [
			{color:color1, offset:0},
			{color:color2, offset:1}
		],
		id,
		gradientUnits: 'userSpaceOnUse'
	}
	if (grad1.gradienttransform)
		// to do lerp gradienttransform?? matrix + rotate
		fillobj.gradienttransform = grad1.gradienttransform
	return fillobj
}

export function _fixGrads(grad1, grad2) {
	let grad, othergrad
	let flip = 1
	if (!grad1.id) {
		grad = grad1
		othergrad = grad2
	} else {
		flip = 2
		grad = grad2
		othergrad = grad1
	}
	grad = {
		x1: othergrad.x1,
		x2: othergrad.x2,
		y1: othergrad.y1,
		y2: othergrad.y2,
		id: othergrad.id,
		color1: grad,
		color1Offset: 0,
		color2: grad,
		color2Offset: 1,
		gradientUnits: 'userSpaceOnUse'
	}
	if (othergrad.gradienttransform) {
		// TODO - matrix 3d transform
		grad.gradienttransform = othergrad.gradienttransform
	}
	return {
		grad1: flip === 1 ? grad : othergrad,
		grad2: flip === 1 ? othergrad : grad
	}
}

function generateTextureGradient(width, height, { y1, x1, y2, x2, colors }) {
	width *= 1
	height *= 1
	const canvas = new self.OffscreenCanvas(1, 256)
	let context = canvas.getContext('2d')
	context.rect(0, 0, 1, 256)
	let gradient = context.createLinearGradient(x1, y1, x2, y2)
	for (let color of colors) {
		debugger
		gradient.addColorStop(color.offset,  color.color)
	}
	context.fillStyle = gradient
	context.fill()
	return canvas
}

export function createMesh(path, grad) {
	let [,,width, height] = path.viewBox.split(' ')
	var meshData = svgMesh3d(path, {
		scale: 5,
		simplify: 0,
		randomization: 10,
		normalize: true
	})
	var geometry = createGeometry(meshData)
	boxUnwrapUVs(geometry)
	var texture = new Three.CanvasTexture(
		generateTextureGradient(
			width,
			height,
			grad
		)
	)
	var material = new Three.MeshBasicMaterial({
		side: Three.DoubleSide,
		map: texture,
		wireframe: false
	})
	return new Three.Mesh(geometry, material)
}

export function getNumAssets(data) {
	let numAssets = 0
	for (let gdx in data) {
		if (gdx === 'objects') {
			for (let odx in data[gdx]) {
				let object = data[gdx][odx]
				for (let svg in object) {
					numAssets++
				}
			}
			numAssets *= 2
		}
		// if (gdx === 'animations') {
		// 	for (let cdx in data[gdx]) {
		// 		let character = data[gdx][cdx]
		// 		for (let adx in character) {
		// 			let animation  = character[adx]
		// 			if (animation.type === 'animation') {
		// 				for (let segment of animation.sequence) {
		// 					numAssets += segment.frames
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	}
	return numAssets
}

export const colors = {
	aliceblue: '#f0f8ff',
	antiquewhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedalmond: '#ffebcd',
	blue: '#0000ff',
	blueviolet: '#8a2be2',
	brown: '#a52a2a',
	burlywood: '#deb887',
	cadetblue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerblue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkblue: '#00008b',
	darkcyan: '#008b8b',
	darkgoldenrod: '#b8b60b',
	darkgray: '#a9a9a9',
	darkgreen: '#006400',
	darkkhaki: '#bdb76b',
	darkmagenta: '#8b008b',
	darkolivegreen: '#556b2f',
	darkorange: '#ff8c00',
	darkorchid: '#9932cc',
	darkred: '#8b0000',
	darksalmon: '#e9967a',
	darkseagreen: '#8fbc8f',
	darkslateblue: '#483d8b',
	darkslategray: '#2f4f4f',
	darkturquoise: '#00ced1',
	darkviolet: '#9400d3',
	deeppink: '#ff1493',
	deepskyblue: '#00bfff',
	dimgray: '#696969',
	dodgerblue: '#1e90ff',
	firebrick: '#b22222',
	floralwhite: '#fffaf0',
	forestgreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostwhite: '#f8f8ff',
	gold: '#ffd700',
	goldenrod: '#daa520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#adff2f',
	honeydew: '#f0fff0',
	hotpink: '#ff69b4',
	indianred: '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderblush: '#fff0f5',
	lawngreen: '#7cfc00',
	lemonchiffon: '#fffacd',
	lightblue: '#add8e6',
	lightcoral: '#f08080',
	lightcyan: '#e0ffff',
	lightgoldenrodyellow: '#fafad2',
	lightgreen: '#90ee90',
	lightgrey: '#d3d3d3',
	lightpink: '#ffb6c1',
	lightsalmon: '#ffa07a',
	lightseagreen: '#20b2aa',
	lightskyblue: '#87cefa',
	lightslategray: '#778899',
	lightsteelblue: '#b0c4de',
	lightyellow: '#ffffe0',
	lime: '#00ff00',
	limegreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumaquamarine: '#66cdaa',
	mediumblue: '#0000cd',
	mediumorchid: '#ba55d3',
	mediumpurple: '#9370db',
	mediumseagreen: '#3cb371',
	mediumslateblue: '#7b68ee',
	mediumspringgreen: '#00fa9a',
	mediumturquoise: '#48d1cc',
	mediumvioletred: '#c71585',
	midnightblue: '#191970',
	mintcream: '#f5fffa',
	mistyrose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajowhite: '#ffdead',
	navy: '#000080',
	oldlace: '#fdf5e6',
	olive: '#808000',
	olivedrab: '#6b8e23',
	orange: '#ffa500',
	orangered: '#ff4500',
	orchid: '#da70d6',
	palegoldenrod: '#eee8aa',
	palegreen: '#98fb98',
	paleturquoise: '#afeeee',
	palevioletred: '#db7093',
	papayawhip: '#ffefd5',
	peachpuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cd',
	plum: '#dda0dd',
	powderblue: '#b0e0e6',
	purple: '#800080',
	red: '#ff0000',
	rosybrown: '#bc8f8f',
	royalblue: '#4169e1',
	saddlebrown: '#8b4513',
	salmon: '#fa8072',
	sandybrown: '#f4a460',
	seagreen: '#2e8b57',
	seashell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyblue: '#87ceed',
	slateblue: '#6a5acd',
	slategray: '#708090',
	snow: '#fffafa',
	springgreen: '#00ff7f',
	steelblue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: '#ffffff',
	whitesmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowgreen: '#a9cd32',
	transparent: 'rgba(0, 0, 0, 0)'
}

export const KeysToCodes = {
	0 : 48,
	1 : 49,
	2 : 50,
	3 : 51,
	4 : 52,
	5 : 53,
	6 : 54,
	7 : 55,
	8 : 56,
	9 : 57,
	a : 97,
	b : 98,
	c : 99,
	d : 100,
	e : 101,
	f : 102,
	g : 103,
	h : 104,
	i : 105,
	j : 106,
	k : 107,
	l : 108,
	m : 109,
	n : 110,
	o : 111,
	p : 112,
	q : 113,
	r : 114,
	s : 115,
	t : 116,
	u : 117,
	v : 118,
	w : 119,
	x : 120,
	y : 121,
	z : 122,
	A : 65,
	B : 66,
	C : 67,
	D : 68,
	E : 69,
	F : 70,
	G : 71,
	H : 72,
	I : 73,
	J : 74,
	K : 75,
	L : 76,
	M : 77,
	N : 78,
	O : 79,
	P : 80,
	Q : 81,
	R : 82,
	S : 83,
	T : 84,
	U : 85,
	V : 86,
	W : 87,
	X : 88,
	Y : 89,
	Z : 90,
	ENTER : 13,
	LEFT_ARROW: 37,
	RIGHT_ARROW: 39,
	UP_ARROW: 38,
	DOWN_ARROW: 40,
	SPACE: 32,
	SHIFT: 16,
	TAB: 9
}

export const CodesToKeys = {
	48 : '0',
	49 : '1',
	50 : '2',
	51 : '3',
	52 : '4',
	53 : '5',
	54 : '6',
	55 : '7',
	56 : '8',
	57 : '9',
	97 : 'a',
	98 : 'b',
	99 : 'c',
	100 : 'd',
	101 : 'e',
	102 : 'f',
	103 : 'g',
	104 : 'h',
	105 : 'i',
	106 : 'j',
	107 : 'k',
	108 : 'l',
	109 : 'm',
	110 : 'n',
	111 : 'o',
	112 : 'p',
	113 : 'q',
	114 : 'r',
	115 : 's',
	116 : 't',
	117 : 'u',
	118 : 'v',
	119 : 'w',
	120 : 'x',
	121 : 'y',
	122 : 'z',
	65 : 'A',
	66 : 'B',
	67 : 'C',
	68 : 'D',
	69 : 'E',
	70 : 'F',
	71 : 'G',
	72 : 'H',
	73 : 'I',
	74 : 'J',
	75 : 'K',
	76 : 'L',
	77 : 'M',
	78 : 'N',
	79 : 'O',
	80 : 'P',
	81 : 'Q',
	82 : 'R',
	83 : 'S',
	84 : 'T',
	85 : 'U',
	86 : 'V',
	87 : 'W',
	88 : 'X',
	89 : 'Y',
	90 : 'Z',
	13 : 'ENTER',
	37 : 'LEFT_ARROW',
	39 : 'RIGHT_ARROW',
	38 : 'UP_ARROW',
	40 : 'DOWN_ARROW',
	32 : 'SPACE',
	6 : 'SHIFT',
	9 : 'TAB'
}
