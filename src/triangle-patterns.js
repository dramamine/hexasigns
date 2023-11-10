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
const linesOut = (fixture, tick, side) => {
  // ct is the brightest frame
  const rate = 32
  const fade = 0.25
  const ct = (rate / 2 * side + tick * fade) % rate
  const DIM = 0.06

  const hue = (Math.floor(tick / 24) * 0.05) % 1

  utils.byhexradius.forEach((row, idx) => {
    const brightness = (idx <= ct)
      ? Math.max(0, 0.6 - DIM * (ct - idx))
      : 0;
    const hueOffset = 0.1 * Math.cos(idx / 2)
    const rgb = hslToRgb(hue + hueOffset, 0.6, brightness)
    row.forEach(led => {
      setColor(fixture, led, rgb)
    })
  })
}

// lines coming out from the center
const spinesOut = (fixture, tick, side) => {
  // ct is the brightest frame
  const rate = 4
  const fade = 1
  const ct = (rate/2 * side + tick*fade) % rate
  const DIM = 0.03

  const hue = (.5*side + Math.floor(tick/rate) * 0.05) % 1

  utils.byhexradius.forEach((row, idx) => {
    const brightness = 0.7 - (0.07 * idx)
    const hueOffset = 0.2 * Math.cos(idx/2)
    const rgb = hslToRgb(hue + hueOffset, 0.5 + 0.2 * brightness, brightness)
    row.forEach(led => {
      setColor(fixture, led, rgb)
    })
  })
}

const triforce = (fixture, tick, oddTriangle = false, side) => {
  const HUE_SPEED = 1/1000
  const animation = (
    Math.floor(tick / 48) +
    (oddTriangle ? 1 : 0) +
    (side ? 2 : 0)
    ) % 4
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

    color = hslToRgb((0.6 + HUE_SPEED * tick) % 1, 0.6, brightness)
  } else if (animation >= 2 && !outline) {
    color = hslToRgb((0.2 + HUE_SPEED * tick) % 1, 0.6, brightness)
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
    const rgb = hslToRgb(hue % 1,
      0.55 + 0.20 * Math.sin(tick * 2*BRITE_SPEED),
      0.45 + 0.10 * Math.cos(tick * BRITE_SPEED)
      )
    leds = utils.getByAngle(idx);
    leds.forEach(led => {
      setColor(fixture, led, rgb)
    });
  });
}

// from spreadsheet magic
const tickToBrightness = (tick, led) => {
/*
pseudo-code:
use ticks to pick a frame
use cosine to get brightness (-1 to 1: make this lots of 0 to 1)
*/

  // -1 + 2 * Math.cos((x % 24) / 3.855)
  let val = Math.cos((tick % 24) / 3.855)
  if ([0, 1, 14, 2, 13, 15].includes(led)) {
    val = val - 0.3
  } else if ([6, 7, 8, 9, 19, 20, 21, 22, 28, 29, 30, 31, 33, 34, 35].includes(led)) {
    val = val + 0.3
  }
  // console.log(tick, led, val)
  return Math.min( Math.max(0, val), 1)
}

const clocker2 = (fixture, tick, pos) => {
  // let hue offset get crazier over time.
  // offset 0.01 to 0.05 (*i so up to .55 different)
  const HUE_OFFSET = 0.03 - 0.02 * Math.cos(tick / 628)
  // console.log(HUE_OFFSET)

  const HUE_SPEED = 1/(24*16)
  const hue = tick * HUE_SPEED // + pos * HUE_OFFSET

  for (let i=0; i<utils.byangle.length; i++) {
    const frame = Math.floor(tick) + i + (pos > 0 ? 12 : 0)
    utils.byangle[i].forEach(led => {
      const brightness = tickToBrightness(frame, led)
      const rgb = hslToRgb((hue + (HUE_OFFSET*i)) % 1, brightness-0.2, brightness/3)
      // console.log('using brightness:', tick+i, brightness)
      setColor(fixture, led, rgb)
    })
  }
}

const warpdrive = (fixture, tick, pos) => {
  const lineToHighlight = ( Math.round(tick / 4) + (pos * 8)) % 24
  const HUE_SPEED = 0.005

  let posToBeRed = (4 - Math.round((tick)/32)) % 6
  while (posToBeRed < 0) { posToBeRed += 6 }
  // if (pos === 1) console.log(tick, posToBeRed)
  // const base = Math.round(tick / (4*24)) % 2
  // console.log(tick, base)
  // const isPosTop = (Math.round(tick/(4*12)) + pos) % 6 <= 2 ? 1 : 0
  // const isPosTop = pos <= 2 ? 1 : 0

  // @TODO couple frames wrong on pos 0.

  const hueOffset = .25 * Math.cos(tick * HUE_SPEED)
  const hue = (pos >= posToBeRed-1 && pos <= posToBeRed+1
    ? .75
    : .25) + hueOffset
  // if (pos !== 1) return
  // console.log(pos, base, selectedPos, diff)
  // const posToAlt = Math.ceil(5 - (base+2)/4)
  // const hue = posToAlt - pos <= 2 && posToAlt - pos >= 0
  //   ? 0.5
  //   : 0
  // if (pos === 1) console.log(base, posToAlt, pos, hue)
  let brightness, rgb
   utils.byhexradius.map((leds, idx) => {
    brightness = idx > lineToHighlight ||( idx + lineToHighlight) % 2 == 1
      ? 0
      : 0.1 * Math.max(0, 7 - lineToHighlight + idx)
     rgb = hslToRgb(hue, 0.6, brightness/2)
     leds.forEach(led => setColor(fixture, led, rgb))
   })
}

const posToSection = [
  [4, 5, 6, 7],
  [2, 3, 4],
  [0, 1, 2],
]
const bladez = (fixture, tick, pos) => {
  const posOffset = Math.floor((pos + tick/18) % 3)

  for(let i=0; i<8; i++) {
    const leds = utils.bydistance[i]
    let rgb = [0,0,0]
    if (posToSection[posOffset].includes(i)) {
      const hue = (pos * 0.2 + tick/(48*8)) % 1
      const brite = 0.35 + 0.2 * Math.sin(tick/18)
      rgb = hslToRgb(hue, 0.6, brite)
    }
    leds.forEach(led => setColor(fixture, led, rgb))
  }
}

const scale = (val, min, max, newMin, newMax) => {
  const valAsPct = (val - min) / (max - min)
  const res = newMin + valAsPct * (newMax - newMin)
  return res
}

const snakeOne = (fixture, tick, pos) => {
  const animFrame = tick/2 + (pos ? 15 : 0) % 120

  let hue = (tick + (pos ? 300 : 0) % 500) / 500
  hue = scale(hue, 0, 1, 0.025, 0.05)

  const leds = utils.getByRadius(pos % 2)
  leds.forEach((led, idx) => {
    const distance = (animFrame % 40) - idx
    let brite = 0
    let rgb = [0, 0, 0]
    if (distance >= 0 && distance < 10) {
      brite = 0.7 - (0.07 * distance)
      rgb = hslToRgb(hue, brite+.1, Math.max(brite - .5, 0.1))
    }

    setColor(fixture, led, rgb)
  })
}

const snake2 = (fixture, tick, pos) => {
  // this pattern gets fast - skip frames
  if (tick % 2 == 1) return
  tick = tick / 2
  const reversePos = (6 - pos) % 6

  const radii = [7, 5, 3]
  const nonRadii = [6,4,2,1,0]
  const snakeHue = (tick % 500) / 500
  let bgHue = ((250 + tick) % 500) / 500
  bgHue = scale(bgHue, 0, 1, 0.025, 0.05)
  const bgRgb = hslToRgb(bgHue, 0.6, 0.08)
  const bgtracksRgb = hslToRgb(bgHue, 0.8, 0.03)

  radii.forEach(radius => {
    let brite
    let leds = utils.byhexradius[radius]
    utils.byhexradius[radius].forEach((led, idx) => {
      const effectivePos = idx + reversePos * leds.length
      // add 48 to account for edge cases
      const diff = (48 + tick - effectivePos) % (6 * leds.length)
      // if (reversePos !== 5) return
      brite = (diff >= 0 && diff < 5)
        ? 0.3 + diff * 0.08
        : 0
      // if (brite > 0) console.log(`${tick}: using brite ${brite} with diff ${diff} pos ${pos} rversePos ${reversePos} effectivePos ${effectivePos}`)
      rgb = brite > 0
        ? hslToRgb(snakeHue, brite, Math.max(brite - .3, 0))
        : bgtracksRgb
      setColor(fixture, led, rgb)
    })
  })
  nonRadii.forEach(radius => {
    utils.byhexradius[radius].forEach(led => setColor(fixture, led, bgRgb))
  })
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

const redEach = (config, pos) => {
  console.log(config.groups);
  config.groups.all.forEach(fixture => {
    setColor(fixture, pos, [200, 0, 0])
  })
}



module.exports = {
  basicTriangle,
  blackEach,
  bladez,
  clocker,
  clocker2,
  linesOut,
  spinesOut,
  snakeOne,
  snake2,
  triforce,
  warpdrive,
  whiteEach,
  whiten,
  zoomTriangle,
  redEach,
}
