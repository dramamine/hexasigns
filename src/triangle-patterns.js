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

const zoomTriangle = (fixture, tick, pos, spread=true) => {
  const HUE_SPEED = 0.009
  // 0.5 is full rainbow
  const HUE_RANGE = 0.5
  const POS_HUE_OFFSET = spread ? 1/6 : 0
  const BRITE_SPEED = 0.005
  const BRITE_RANGE = 0.2
  const startHue = tick * HUE_SPEED + pos * POS_HUE_OFFSET
  
  const endHue = startHue + HUE_RANGE
  const hues = utils.spread(startHue, endHue, 3)

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

// lines coming out from the center
const linesOut = (config, tick) => {
  const ct = tick % 24
  // ct is the brightest frame
  const DIM = 0.12

  const hue = (Math.floor(tick/24) * 0.1) % 1


  utils.byhexradius.forEach((row, idx) => {
    const brightness = (idx <= ct) 
      ? Math.max(0, 0.6 - DIM * (ct - idx))
      : 0;
    console.log('using brightness', brightness, ct, idx)
    const rgb = hslToRgb(hue, 0.6, brightness)
    row.forEach(led => {
      config.groups.all.forEach(fixture => {
        utils.setColor(fixture, led, rgb)
      })
    })
  })
}

const whiten = (fixture, tick) => {
  const wav = tick % 40 // 0-39 position
  const strength = 20 - Math.abs(20 - wav)
  const rgb = strength
  utils.setColor(fixture, 0, Array.from(Array(36*3), () => rgb))
}

const whiteEach = (config, pos) => {
  config.groups.all.forEach(fixture => {
    utils.setColor(fixture, pos, [200, 200, 200])
  })
}

// activate the last light in the line
const blackEach = (config, pos) => {
  config.groups.all.forEach(fixture => {
    utils.setColor(fixture, pos, [0, 0, 0])
  })
}


module.exports = {
  basicTriangle,
  zoomTriangle,
  whiten,
  whiteEach,
  blackEach,
  linesOut
}
