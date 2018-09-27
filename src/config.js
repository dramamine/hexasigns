const REVERSE = true
const LEDS_PER_STRING = 50
const LEDS_USED_PER_STRING = 28

const getTriangle = (min_channel, universe = 1) => {
  return {
    min_channel,
    universe: 1
  }
}

const triangles = {
  TRIANGLE_1: getTriangle(1 + 150*0 + (50 - 28) * 3),
  TRIANGLE_2: getTriangle(1 + 150*1 + (50 - 28) * 3),
  TRIANGLE_3: getTriangle(1 + 150*2 + (50 - 28) * 3),
  TRIANGLE_4: getTriangle(1 + 150*3 + (50 - 28) * 3),
  TRIANGLE_5: getTriangle(1 + 150*4 + (50 - 28) * 3),
  TRIANGLE_6: getTriangle(1 + 150*5 + (50 - 28) * 3)
}

const config = {
  groups: {
    all: [
      triangles.TRIANGLE_1,
      triangles.TRIANGLE_2
      // triangles.TRIANGLE_3,
      // triangles.TRIANGLE_4,
      // triangles.TRIANGLE_5,
      // triangles.TRIANGLE_6
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
