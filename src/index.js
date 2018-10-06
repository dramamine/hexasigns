const config = require('./config')
const {setColor, hexToRgb, getGradients, blackout} = require('./utils')
const {hslToRgb} = require('./color-conversion')
const {basicTriangle} = require('./triangle-patterns');

const activateFirstLights = () => {
  config.groups.all.forEach(fixture => {
    setColor(fixture, 0, [200, 200, 200])
  });
}

const activateLastLights = () => {
  config.groups.all.forEach(fixture => {
    setColor(fixture, 27, [200, 200, 200])
  });
}

const prettify = (ticks) => {
  const hue = (ticks/100) % 1;
  console.log('using hue', hue);
  const gradient = getGradients(
    hslToRgb(hue, 0.7, 0.5),
    hslToRgb(hue, 0.1, 0.0),
    28
  )

  config.groups.all.forEach(fixture => {
    setColor(fixture, 0, gradient)
  });
}




let ticks = 0
const first_and_last_then_pretty = () => {
  ticks = ticks + 1

  // prettify(ticks)

  if (ticks > 240) {
    return prettify(ticks)
  }

  if (ticks % 24 !== 0) return
  if (Math.floor(ticks/24) % 2 == 0) {
    blackout(config)
  } else if (Math.floor(ticks/24) % 4 == 1) {
    activateFirstLights()
  } else if (Math.floor(ticks/24) % 4 == 3) {
    activateLastLights()
  }
}

const triangle_patterns = () => {
  ticks = ticks + 1
  config.groups.all.forEach(fixture => {
    basicTriangle(fixture, ticks)
  });
}


const start = Date.now()
const loop = setInterval(triangle_patterns, 41)

process.on('SIGINT', () => {
  console.log('Do something useful here.')
  clearInterval(loop)
  blackout(config, () => {
    process.exit(0)
  })
})
