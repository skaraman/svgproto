import * as rematrix from 'rematrix'

export function bindAll(ring, o) {
	for (let odx = 0; odx < o.length; odx++) {
		ring[o[odx]] = ring[o[odx]].bind(ring)
	}
}

export function intParse(value) {
	return ~~value
}

export function isDefined(value) {
	return value !== undefined && value !== null
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

// HEX color
export function lerpColor(color1, color2, amount) {
	if (!color1.startsWith('#') && !color2.startsWith('#')) {
		if (color1 === 'none' || color2 === 'none') return 'none'
		// console.log('use #HEXfmt', color1, color2)
		if (!color1.startsWith('#')) {
			color1 = colorMap[color1.toLowerCase()]
		}
		if (!color2.startsWith('#')) {
			color2 = colorMap[color2.toLowerCase()]
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
	if (grad1.color1) color1 = lerpColor(
		grad1.color1 || '#000000',
		grad2.color1 || '#000000',
		amount
	)
	let color2 = null
	if (grad2.color2) color2 = lerpColor(
		grad1.color2 || '#000000',
		grad2.color2 || '#000000',
		amount
	)
	let fillobj = {
		x1,
		x2,
		y1,
		y2,
		color1,
		color2,
		id,
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

export function addGradientToDOM(grad) {
	console.log('addGradientToDOM')
}

const colorMap = {
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
