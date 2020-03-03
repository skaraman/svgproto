import SVGPathCollider from '../index'

let svgElm
let polygons = []
const colorMap = {
	0: '#88ee88',
	1: '#b266de',
	2: '#f1085d',
	3: '#2b37e8'
}

window.onload = () => {
	svgElm = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	const svgElmSize = 480
	svgElm.setAttribute('width', `${svgElmSize}`)
	svgElm.setAttribute('height', `${svgElmSize}`)
	document.body.appendChild(svgElm)
	// create two polygons
	let polys = [
		['penta', 5, 70, 5, 160, 240, 0.5],
		['septa', 7, 100, 7, 320, 240, 0.3],
		['tri', 3, 80, 3, 200, 340, 0.3],
		['quad', 4, 80, 4, 200, 110, 0.3]
	]
	for (let poly of polys) {
		let [id, a, b, c, x, y, z] = poly
		polygons.push(new Polygon(id, a, b, c, x, y, z))
	}
	updatePolygons()
}

function updatePolygons() {
	requestAnimationFrame(updatePolygons)
	for (let poly of polygons) {
		poly.update()
	}

	let pArr = polygons.copy()
	let hits = {}

	while (pArr.length) {
		debugger
		let polygon1 = pArr.pop()
		hits[polygon1.id] = hits[polygon1.id] || 0
		let fillColor = colorMap[hits[polygon1.id]]
		for (let pdx = 0; pdx < pArr.length; pdx++) {
			let polygon2 = pArr[pdx]
			// test if two polygons are colliding
			if (polygon1.spc.test(polygon2.spc)) {
				hits[polygon1.id] += 1
				hits[polygon2.id] = hits[polygon2.id] + 1 || 1
				fillColor = colorMap[hits[polygon1.id]]
			}
		}
		polygon1.path.setAttribute('fill', fillColor)
	}
}

class Polygon {
	constructor(id, n, r, separationNum, x, y, angleVel) {
		this.id = id
		this.angleVel = angleVel
		this.angle = 0
		this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
		let pathStr = `M0,${r} `
		for (let i = 0; i < n; i++) {
			var d = i * 6.28 / n
			pathStr += ` ${Math.sin(d) * r},${Math.cos(d) * r},`
		}
		pathStr += 'z'
		this.path.setAttribute('d', pathStr)
		this.path.setAttribute('fill', '#fff')
		this.g.appendChild(this.path)
		svgElm.appendChild(this.g)
		// instantiate SVGPathCollider with params:
		//  (SVGPathElement testing a collision,
		//   number of points on the path used for
		//    creating polygons to detect a collision (SAT.Polygon)
		//    (default = 16),
		//   true when the path forms a concave shape
		//    (a concave shape is separated into triangles from
		//     a point at a center of the shape)
		//    (default = false))
		this.spc = new SVGPathCollider(this.path, separationNum)
		this.pos = { x, y }
	}

	update() {
		this.angle += this.angleVel
		this.g.setAttribute('transform', `translate(${this.pos.x},${this.pos.y}) rotate(${this.angle})`)
		// update a collision area when a path is transformed
		this.spc.update()
	}
}
