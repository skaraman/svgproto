var inherits = require('inherits')
var getBounds = require('svg-path-bounds')

module.exports = function(Three) {
	function Complex(mesh, svgPath) {
		if (!(this instanceof Complex)){
			return new Complex(mesh, svgPath)
		}
		Three.Geometry.call(this)
		this.dynamic = true
		this.svgPath = svgPath
		if (mesh){
			this.update(mesh)
		}
	}

	inherits(Complex, Three.Geometry)

	//may expose these in next version
	Complex.prototype._updatePositions = function(positions) {
		for (var i=0; i<positions.length; i++) {
			var pos = positions[i]
			if (i > this.vertices.length-1) {
				this.vertices.push(new Three.Vector3().fromArray(pos))
			}
			else {
				this.vertices[i].fromArray(pos)
			}
		}
		this.vertices.length = positions.length
		this.verticesNeedUpdate = true
	}

	Complex.prototype._updateCells = function(cells) {
		for (var i=0; i<cells.length; i++) {
			var face = cells[i]
			if (i > this.faces.length-1){
				this.faces.push(new Three.Face3(face[0], face[1], face[2]))
			}
			else {
				var tf = this.faces[i]
				tf.a = face[0]
				tf.b = face[1]
				tf.c = face[2]
			}
		}
		this.faces.length = cells.length
		this.elementsNeedUpdate = true
	}

	Complex.prototype._updateBoundingBox = function() {
		let [left, top, right, bottom] = getBounds(this.svgPath)
		let bb = {min:{x:left,y:top,z:1},max:{x:right,y:bottom,z:1}}
		let clone = () => (this.boundingBox)
		this.boundingBox = {
			...bb,
			clone
		}
	}

	Complex.prototype.update = function(mesh) {
		this._updatePositions(mesh.positions)
		this._updateCells(mesh.cells)
		// this._updateBoundingBox()
	}

	return Complex
}
