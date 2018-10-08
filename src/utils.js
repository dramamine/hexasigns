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
// queue up some color changes
// @TODO: swap this out for setColor and hope it Just Works
const setColorQueue = (fixture, pos, ...colors) => {

  if (!queuedColors[fixture]) {
    queuedColors[fixture] = new Array(510)
  }

  // find the correct channel
  const startPos = fixture.min_channel + 3 * pos

  // replace colors in our color array. overwrites things (hopefully just nulls)
  const colorsArr = flatten(colors)
  for (let i = 0; i < colorsArr; i++) {
    queuedColors[fixture][startPos+i] = colorsArr[i]
  }

  // set our timeout the first time through the loop
  if (!colorQueueTimeout) {
    setTimeout(setColorTimeout, 0)
  }

  // artnet.set(fixture.universe, startPos, flatten(colors))
}

setColorTimeout = () => {
  for (let [fixture, colorArr] of queuedColors) {
    artnet.set(fixture, 0, colorArr)
  }
  // cleanup
  queuedColors = {}
  colorQueueTimeout = null
}

/**
 *
 *
 *
 *             6
 *            7 5
 *         17  8 4
 *       18 16  9 3
 *     24 19 15 10 2
 *   25 23 20 14 11 1
 * 27 26 22 21 13 12 0
 *
 * Get LED positions by row
 */
const byrow = [
  [27, 26, 22, 21, 13, 12, 0],
  [25,23,20,14,11,1],
  [24,19,15,10,2],
  [18,16,9,3],
  [17, 8, 4],
  [7, 5],
  [6]
];

const getByRow = (row) => {
  return byrow[row] || []
}


const byradius = [
  [0,1,2,3,4,5,6,7,17,18,24,25,27,26,22,21,13,12],
  [11,10,9,8,16,19,23,20,14],
  [15]
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
  getByRow,
  spread
}
