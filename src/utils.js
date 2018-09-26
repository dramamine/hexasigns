const artnet = require('./artnet')

// https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
const flatten = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

const setColor = (fixture, pos, ...colors) => {
  // find the correct channel
  const startPos = fixture.min_channel + 3 * pos
  artnet.set(fixture.universe, startPos, flatten(colors))
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRgb = (hex) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
}

// scale from one color to the next
const getGradients = (colorA, colorB, len) => {
  if (!Array.isArray(colorA)) {
    colorA = hexToRgb(colorA)
  }
  if (!Array.isArray(colorB)) {
    colorB = hexToRgb(colorB)
  }
  const colorDiffs = [
    colorB[0] - colorA[0],
    colorB[1] - colorA[1],
    colorB[2] - colorA[2]
  ]
  const result = []
  for (let i=0; i<len; i++) {
    result.push([
      colorA[0] + (colorDiffs[0] * i/len),
      colorA[1] + (colorDiffs[1] * i/len),
      colorA[2] + (colorDiffs[2] * i/len),
    ])
  }
  return result
}

// blackout - useful for killing process
const blackout = (config, callback) => {
  config.groups.one.forEach(fixture => {
    artnet.set(fixture.universe, 1, Array(50*3).fill(0), (err, res) => {
      callback(res)
    })
  });
}


module.exports = {
  setColor,
  flatten,
  hexToRgb,
  getGradients,
  blackout
}
