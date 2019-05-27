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
        let fill = paths[cdx].attributes.fill
        if (fill.startsWith('url')) {
          fill = fill.replace(')', `_${ndx})`)
          paths[cdx].attributes.fill = fill
        }
        this.paths.push({ entity: ndx, ...paths[cdx] })
      }
      let grads = node.svg.children[0].children
      for (let cdx = 0; cdx < grads.length; cdx++) {
        this.gradients.push({ entity: ndx, ...grads[cdx] })
      }
    }
  }

  update(nodes) {
    for (let ndx in nodes) {
      let node = nodes[ndx]
      debugger
    }
  }

  getPaths() {
    return this.paths
  }

  getGradients() {
    return this.gradients
  }

  getEntities() {
    return this.entities
  }

}

export default new Hierarchy