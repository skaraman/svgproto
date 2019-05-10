function arraysToUniqueObj() {
  if (!arguments) return null
  var output = {}
  for (let j = 0; j < arguments.length; j++) {
    let args = arguments[j]
    for (let i = 0; i < args.length; i++) {
      let newKey = args[i]
      if (!output[newKey]) {
        output[newKey] = newKey
      }
    }
  }
  return output
}

function objectAssignAll(target, source) {
  for (let key in source) {
    let value = source[key]
    if (typeof value === 'object' && typeof target[key] === 'object') {
      value = objectAssignAll(target[key], value)
    }
    target[key] = value
  }
  return target
}

//HEX Color
function lerpColor(color1, color2, amount) {
  if (!color1.startsWith('#') && !color2.startsWith('#')) {
    console.warn('use #HEXFMT')
    return color1
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

// Gradient
function lerpGradient(grad1, grad2, amount) {
  if (!grad1.attributes || !grad2.attributes) {
    let grads = _fixGrads(grad1, grad2)
    grad1 = grads.grad1
    grad2 = grads.grad2
  }
  let x1 = ((grad2.attributes.x1 - grad1.attributes.x1) * amount) + (grad1.attributes.x1 * 1)
  let x2 = ((grad2.attributes.x2 - grad1.attributes.x2) * amount) + (grad1.attributes.x2 * 1)
  let y1 = ((grad2.attributes.y1 - grad1.attributes.y1) * amount) + (grad1.attributes.y1 * 1)
  let y2 = ((grad2.attributes.y2 - grad1.attributes.y2) * amount) + (grad1.attributes.y2 * 1)
  let id = grad1.attributes.id
  let color1 = null
  if (grad1.children[0]) color1 = lerpColor(
    grad1.children[0].attributes['stop-color'] || '#000',
    grad2.children[0].attributes['stop-color'] || '#000',
    amount
  )
  let color2 = null
  if (grad2.children[1]) color2 = lerpColor(
    grad1.children[1].attributes['stop-color'] || '#000',
    grad2.children[1].attributes['stop-color'] || '#000',
    amount
  )
  let fillObj = {
    x1,
    x2,
    y1,
    y2,
    color1,
    color2,
    id,
  }
  if (grad1.attributes.gradientTransform)
    // to do lerp gradientTransform?? matrix + rotate
    fillObj.gradientTransform = grad1.attributes.gradientTransform
  return fillObj
}

function _fixGrads(grad1, grad2) {
  let grad
  let flip = 1
  if (!grad1.attributes) {
    grad = grad1
    otherGrad = grad2
  } else {
    flip = 2
    grad = grad2
    otherGrad = grad1
  }
  grad = {
    attributes: {
      x1: otherGrad.attributes.x1,
      x2: otherGrad.attributes.x2,
      y1: otherGrad.attributes.y1,
      y2: otherGrad.attributes.y2,
      id: otherGrad.attributes.id
    },
    children: [{
        attributes: {
          'stop-color': grad,
          'offset': 0
        }
      },
      {
        attributes: {
          'stop-color': grad,
          'offset': 1
        }
      }
    ],
    key: undefined,
    nodeName: 'linearGradient'
  }
  if (otherGrad.attributes.gradientTransform) {
    grad.attributes.gradientTransform = otherGrad.attributes.gradientTransform
  }
  return {
    grad1: flip === 1 ? grad : otherGrad,
    grad2: flip === 1 ? otherGrad : grad
  }
}

module.exports = {
  objectAssignAll,
  arraysToUniqueObj,
  lerpColor,
  lerpGradient
}