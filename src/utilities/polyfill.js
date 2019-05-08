Array.prototype.copy = function () {
  var output = [],
    v, key
  for (let i = 0; i < this.length; i++) {
    v = this[i]
    output[i] = v
  }
  return output
}

Array.prototype.insert = function (index, value) {
  var v, shiftValue, startShift = false,
    len = this.length
  if (index >= this.length) index = this.length - 1
  for (let i = index; i < len + 1; i++) {
    v = this[i]
    if (i === index) {
      this[i] = value
      startShift = true
      shiftValue = v
    } else if (startShift) {
      this[i] = shiftValue
      shiftValue = v
    }
  }
}
