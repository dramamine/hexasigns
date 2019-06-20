const artnet = require('./artnet')

// # of universes - remember to keep this updated!
const {universes} = require('./config')

const queuedColors = []

// https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
const flatten = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}


const begin = () => {
  for (let i = 0; i < universes; i++) {
    queuedColors[i] = new Array(510)
  }
}

const setColor = (fixture, pos, ...colors) => {
  const { universe, min_channel } = fixture
  // find the correct channel
  const startPos = min_channel + 3 * pos

  // replace colors in our color array. overwrites things (hopefully just nulls)
  const colorsArr = flatten(colors)
  colorsArr.forEach((color, idx) => {
    queuedColors[universe-1][startPos + idx] = color
  })
}

const end = () => {
  queuedColors.forEach((colorArr, universe) => {
    artnet.set(universe+1, 0, colorArr)
  })
}

module.exports = {
  begin,
  end,
  setColor
}