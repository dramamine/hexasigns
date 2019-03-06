const artnet = require('./artnet')

/**
 *         7
 *        6  8
 *       5  9 20
 *      4 10 19 21
 *     3 11 18 22 29
 *    2 12 17 23 28 30
 *   1 13 16 24 27 31 34
 *  0 14 15 25 26 32 33 35
 *
 * Get LED positions by row
 */

const byangle = [
  [0, 14, 15, 25, 26, 32, 33, 35],
  [31, 34],
  [27, 30],
  [28, 24],
  [16, 23, 29],
  [13, 17, 22],
  [12, 18, 21],
  [11, 19],
  [10, 20],
  [8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8]
]

const byrow = [
  [0,14,15,25,26,32,33,35],
  [1,13,16,24,27,31,34],
  [2,12,17,23,28,30],
  [3,11,18,22,29],
  [4,10,19,21],
  [5,9,20],
  [6,8],
  [7]
];

const getByRow = (row) => {
  return byrow[row] || []
}

// grouped by distance from the center of the hex
const byhexradius = [
  [0],
  [1,14],
  [2,13,15],
  [3,12,16,25],
  [4,11,17,24,26],
  [5,10,18,23,27,32],
  [6,9,19,22,28,31,33],
  [7,8,20,21,29,30,34,35]
]


const byradius = [
  [0,1,2,3,4,5,6,7,8,20,21,29,30,34,35,33,32,26,25,15,14],
  [13,12,11,10,9,19,22,28,31,27,24,16],
  [17,18,23]
]
const getByRadius = (row) => {
  return byradius[row] || []
}

const getTriforce = (outline = false) => {
  if (outline) {
    return [0, 14, 15, 25, 26, 32, 33, 35, 16, 27, 12, 28, 3, 11, 18, 22, 29,4,21,5,20,6,8,7, 1, 2, 30, 34];
  }
  return [13,16,12,
    27,28,31,
    10,19,9];
}

// convert hex value to rgb, ex. 0000FF => [0, 0, 255]
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


const spread = (start, end, len) => {
  const diff = end - start
  const result = []
  for (let i = 0; i < len; i++) {
    result.push(start + (diff * i / len))
  }
  return result
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
const blackout = (config, callback = () => {}) => {
  let killCount = 0
  const universes = [1,2,3]
  universes.forEach((universe) => {
    artnet.set(universe, 1, Array(150 * 3).fill(0), (err, res) => {
      if (killCount < universes.length - 1) {
        killCount++
      } else {
        callback(res)
      }
    })
  })
}


module.exports = {
  setColor,
  flatten,
  hexToRgb,
  getGradients,
  blackout,
  getByRadius,
  byrow,
  getByRow,
  byhexradius,
  spread,
  getTriforce
}
