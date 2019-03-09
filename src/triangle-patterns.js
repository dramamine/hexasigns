const {hslToRgb} = require('./color-conversion')
const utils = require('./utils')
const {setColor} = require('./leds');


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
      setColor(fixture, led, rgb)
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
      setColor(fixture, led, rgb)
    });
  });
}

// lines coming out from the center
const linesOut = (config, tick) => {
  const ct = tick % 24
  // ct is the brightest frame
  const DIM = 0.12

  const hue = (Math.floor(tick/24) * 0.05) % 1


  utils.byhexradius.forEach((row, idx) => {
    const brightness = (idx <= ct) 
      ? Math.max(0, 0.6 - DIM * (ct - idx))
      : 0;
    const rgb = hslToRgb(hue, 0.6, brightness)
    row.forEach(led => {
      config.groups.all.forEach(fixture => {
        setColor(fixture, led, rgb)
      })
    })
  })
}

const triforce = (fixture, tick, oddTriangle = false) => {
  const animation = (Math.floor(tick / 48) + (oddTriangle ? 1 : 0)) % 4
  console.log('using anim frame:', animation)
 //  const frame = tick + (oddTriangle ? 96 : 0)
  const outline = (animation <= 1)
  // these will be either the outline, or the inner content
  const leds = utils.getTriforce(outline)
  let color
  const briteFrames = (animation % 2 === 0)
    ? tick % 48
    : 48 - (tick % 48)
  let brightness = 0.012 * briteFrames
  if (brightness < 0.025) {
    brightness = 0
  }

  if (animation <= 1 && outline) {

    color = hslToRgb(0.6, 0.6, brightness)
  } else if (animation >= 2 && !outline) {
    color = hslToRgb(0.4, 0.6, brightness)
  }

  leds.forEach(led => {
    setColor(fixture, led, color)
  })
}

const clocker = (fixture, tick, pos) => {
  const HUE_SPEED = 1/96
  const HUE_RANGE = 0.5 // 1 would be full rainbow
  const BRITE_SPEED = 0.005
  const startHue = tick * HUE_SPEED + (pos>0 ? 0.5 : 0)
  const endHue = startHue + HUE_RANGE

  const hues = utils.spread(startHue, endHue, 11)
  let leds
  hues.forEach((hue, idx) => {
    const rgb = hslToRgb(hue % 1, 0.8, 0.2) // 0.5 + Math.sin(tick * BRITE_SPEED))
    leds = utils.getByAngle(idx);
    leds.forEach(led => {
      setColor(fixture, led, rgb)
    });
  });
}

const clocker2 = (fixture, tick, pos) => {
  /*
  pseudo-code:
  use ticks to pick a frame
  use cosine to get brightness (-1 to 1: make this lots of 0 to 1)
  */
  // from spreadsheet magic
  const tickToBrightness = x => Math.max(0, 
    // -1 + 2 * Math.cos((x % 24) / 3.855)
    Math.cos((x % 24) / 3.855)
  );

  // let hue offset get crazier over time.
  // offset 0.01 to 0.05 (*i so up to .55 different)
  const HUE_OFFSET = 0.03 - 0.02 * Math.cos(tick / 628)
  // console.log(HUE_OFFSET)

  const HUE_SPEED = 1/(24*16)
  const hue = tick * HUE_SPEED // + pos * HUE_OFFSET

  for (let i=0; i<utils.byangle.length; i++) {
    const frame = Math.floor(tick) + i + (pos > 0 ? 12 : 0)
    const brightness = tickToBrightness(frame)
    const rgb = hslToRgb((hue + (HUE_OFFSET*i)) % 1, brightness-0.2, brightness/3)
    // console.log('using brightness:', tick+i, brightness)
    utils.byangle[i].forEach(led => {
      setColor(fixture, led, rgb)
    })
  }
}


const whiten = (fixture, tick) => {
  const wav = tick % 40 // 0-39 position
  const strength = 20 - Math.abs(20 - wav)
  const rgb = strength
  setColor(fixture, 0, Array.from(Array(36*3), () => rgb))
}

const whiteEach = (config, pos) => {
  config.groups.all.forEach(fixture => {
    setColor(fixture, pos, [200, 200, 200])
  })
}

// activate the last light in the line
const blackEach = (config, pos) => {
  config.groups.all.forEach(fixture => {
    setColor(fixture, pos, [0, 0, 0])
  })
}


module.exports = {
  basicTriangle,
  zoomTriangle,
  whiten,
  whiteEach,
  blackEach,
  linesOut,
  triforce,
  clocker,
  clocker2
}
