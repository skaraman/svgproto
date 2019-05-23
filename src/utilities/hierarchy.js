class Hierarchy {
  constructor() {
    this.paths = []
    this.entities = {}
    this.gradients = []
  }

  add(nodes) {
    for (let ndx in nodes) {
      let node = nodes[ndx]
      this.entities[ndx] = node
      let paths = node.svg.children[2].children[0].children
      for (let cdx = 0; cdx < paths.length; cdx++) {
        this.paths.push(paths[cdx])
      }
      let grads = node.svg.children[0].children
      for (let cdx = 0; cdx < grads.length; cdx++) {
        this.gradients.push(grads[cdx])
      }
    }
  }

  update(nodes) {
    debugger
  }

  getPaths() {
    return this.paths
  }

  getGrads() {
    return this.gradients
  }

}

export default new Hierarchy