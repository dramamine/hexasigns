const LEDS_PER_STRING = 50
const LEDS_USED_PER_STRING = 36

const getTriangle = (universe, min_channel) => {
  return {
    min_channel,
    universe
  }
}

// start at a position, plus, skip the skipped pixels
const skipped_channels = (LEDS_PER_STRING - LEDS_USED_PER_STRING) * 3
const triangles = {
  TRIANGLE_1: getTriangle(1, 150 * 0 + 1 + skipped_channels),
  TRIANGLE_2: getTriangle(1, 150 * 1 + 1 + skipped_channels),
  TRIANGLE_3: getTriangle(1, 150 * 2 + 1 + skipped_channels),
  TRIANGLE_4: getTriangle(2, 150 * 0 + 1 + skipped_channels),
  TRIANGLE_5: getTriangle(2, 150 * 1 + 1 + skipped_channels),
  TRIANGLE_6: getTriangle(2, 150 * 2 + 1 + skipped_channels)
}

const config = {
  groups: {
    all: [
      triangles.TRIANGLE_1,
      triangles.TRIANGLE_2,
      triangles.TRIANGLE_3,
      triangles.TRIANGLE_4,
      triangles.TRIANGLE_5,
      triangles.TRIANGLE_6
    ],
    evens: [
      triangles.TRIANGLE_2,
      triangles.TRIANGLE_4,
      triangles.TRIANGLE_6
    ],
    odds: [
      triangles.TRIANGLE_1,
      triangles.TRIANGLE_3,
      triangles.TRIANGLE_5
    ],

    one: [
      triangles.TRIANGLE_1
    ],

  }
}

module.exports = config
