Array.prototype.copy = function () {
    var output = [],
        v, key
    for (let i = 0; i < this.length; i++) {
        v = this[i]
        output[i] = v
    }
    return output
}