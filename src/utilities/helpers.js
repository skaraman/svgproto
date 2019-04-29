function arraysToUniqueObj() {
    if (!arguments) return null
    var o = {}
    for (let j = 0; j < arguments.length; j++) {
        let a = arguments[j]
        for (let i = 0; i < a.length; i++) {
            let newKey = a[i]
            if (!o[newKey]) {
                o[newKey] = newKey
            }
        }
    }
    return o
}

function objectAssignAll(target, source) {
    for (let key in source) {
        let value = source[key];
        if (typeof value === 'object' && typeof target[key] === 'object') {
            value = objectAssignAll(target[key], value)
        }
        target[key] = value;
    }
    return target
}

//HEX Color
function lerpColor(a, b, amount) {
    if (amount === 0) {
        return a;
    } else if (amount === 1) {
        return b;
    }
    var ah = +a.replace('#', '0x'),
        ar = ah >> 16,
        ag = ah >> 8 & 0xff,
        ab = ah & 0xff,
        bh = +b.replace('#', '0x'),
        br = bh >> 16,
        bg = bh >> 8 & 0xff,
        bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab)
    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1)
}

module.exports = {
    objectAssignAll,
    arraysToUniqueObj,
    lerpColor
}