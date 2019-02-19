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

let queuedColors = {}
let colorQueueTimeout

setColorTimeout = () => {
  for (let [universe, colorArr] of queuedColors) {
    artnet.set(universe, 0, colorArr)
  }
  // cleanup
  queuedColors = {}
  colorQueueTimeout = null
}

// queue up some color changes
// @TODO: swap this out for setColor and hope it Just Works
const setColorQueue = (fixture, pos, ...colors) => {
  const {universe, min_channel} = fixture;
  if (!queuedColors[universe]) {
    queuedColors[universe] = new Array(510)
  }

  // find the correct channel
  const startPos = min_channel + 3 * pos

  // replace colors in our color array. overwrites things (hopefully just nulls)
  const colorsArr = flatten(colors)
  for (let i = 0; i < colorsArr; i++) {
    queuedColors[universe][startPos + i] = colorsArr[i]
  }

  // set our timeout the first time through the loop
  if (!colorQueueTimeout) {
    setTimeout(setColorTimeout, 0)
  }

  // artnet.set(fixture.universe, startPos, flatten(colors))
}



/**
 *  old one:
 *
 *                7
 *               8 6
 *            20  9 5
 *          21 19 10 4
 *        29 22 18 11 3
 *      30 28 23 17 12 2
 *    34 31 27 24 16 13 1
 *  35 33 32 26 25 15 14 0
 *
 *  updating to this:
 *
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

// const getByHexRadius = 


const byradius = [
  [0,1,2,3,4,5,6,7,8,20,21,29,30,34,35,33,32,26,25,15,14],
  [13,12,11,10,9,19,22,28,31,27,24,16],
  [17,18,23]
]
const getByRadius = (row) => {
  return byradius[row] || []
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

const spread = (start, end, len) => {
  diff = end - start
  const result = []
  for (let i=0; i<len; i++) {
    result.push(start + (diff * i/len))
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
  killCount = 0
  const universes = [1,2,3]
  universes.forEach(universe => {
    artnet.set(universe, 1, Array(150*3).fill(0), (err, res) => {
      if (killCount < universes.length-1) {
        killCount++
      } else {
        callback(res)
      }
    })
  });
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
  spread
}
