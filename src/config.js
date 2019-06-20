const LEDS_PER_STRING = 50
const LEDS_USED_PER_STRING = 36

// start at a position, plus, skip the skipped pixels
const skipped_channels = (LEDS_PER_STRING - LEDS_USED_PER_STRING) * 3
const triangles = []
for (let i = 0; i < 12; i++) {
  triangles.push({
    universe: 1 + Math.floor(i/3), // first 3 are 1, next 3 are 2, etc.
    min_channel: 150 * (i % 3) + 1 + skipped_channels
  })
}

const config = {
  universes: 4,
  groups: {
    all: [
      triangles[0],
      triangles[1],
      triangles[2],
      triangles[3],
      triangles[4],
      triangles[5],
      triangles[6],
      triangles[7],
      triangles[8],
      triangles[9],
      triangles[10],
      triangles[11]
    ],
    left: [
      triangles[0],
      triangles[1],
      triangles[2],
      triangles[3],
      triangles[4],
      triangles[5]
    ],
    evens: [
      triangles[1],
      triangles[3],
      triangles[5]
    ],
    odds: [
      triangles[0],
      triangles[2],
      triangles[4]
    ],

    one: [
      triangles[0]
    ],

  }
}

module.exports = config