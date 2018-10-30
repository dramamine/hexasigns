const {hslToRgb} = require('./color-conversion')
const utils = require('./utils')


const basicTriangle = (fixture, tick) => {
  const HUE_SPEED = 0.001 //
  const HUE_RANGE = 0.2 // 1 would be full rainbow
  const BRITE_SPEED = 0.005
  const startHue = tick * HUE_SPEED
  const endHue = startHue + HUE_RANGE

  const hues = utils.spread(startHue, endHue, 7);
  let leds;
  hues.forEach((hue, idx) => {
    const rgb = hslToRgb(hue, 0.8, 0.5 + Math.sin(tick * BRITE_SPEED))
    leds = utils.getByRow(idx);
    leds.forEach(led => {
      utils.setColor(fixture, led, rgb)
    });
  });
}

const zoomTriangle = (fixture, tick, pos) => {
  const HUE_SPEED = 0.015 //
  const HUE_RANGE = 0.5 // 1 would be full rainbow
  const POS_HUE_OFFSET = 1/6
  const BRITE_SPEED = 0.005
  const BRITE_RANGE = 0.2
  const startHue = tick * HUE_SPEED + pos * POS_HUE_OFFSET
  console.log(startHue)
  const endHue = startHue + HUE_RANGE
  const hues = utils.spread(startHue, endHue, 3);

  hues.forEach((hue, idx) => {
    // const rgb = hslToRgb(hue, 0.8, 0.5)
    // console.log('xo', hue, rgb, idx)
    // // process.exit(0)
    const rgb = hslToRgb(hue % 1, 0.8, 0.2)
    leds = utils.getByRadius(idx);
    leds.forEach(led => {
      utils.setColor(fixture, led, rgb)
    });
  });
}

const whiten = (fixture, tick) => {
  const wav = tick % 40 // 0-39 position
  const strength = 20 - Math.abs(20 - wav)
  const rgb = strength
  utils.setColor(fixture, 0, Array.from(Array(36*3), () => rgb))
}

module.exports = {
  basicTriangle,
  zoomTriangle,
  whiten
}
