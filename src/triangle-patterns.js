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

const zoomTriangle = (fixture, tick) => {
  const HUE_SPEED = 0.001 //
  const HUE_RANGE = 0.2 // 1 would be full rainbow
  const startHue = tick * HUE_SPEED
  const endHue = startHue + HUE_RANGE
  const hues = utils.spread(startHue, endHue, 7);
}

module.exports = {
  basicTriangle,
  zoomTriangle
}
