
const config = require('./config')
const {blackout} = require('./utils')
const patterns = require('./triangle-patterns');
const leds = require('./leds')

// how many frames have passed?
let ticks = 0

let runtimes = {
  frames: 0,
  max: 0,
  avg: 0
}

// calculate some things about performance
const handleRuntime = (start) => {
  const runtime = Date.now() - start
  runtimes.max = Math.max(runtimes.max, runtime)
  runtimes.frames += 1
  runtimes.avg = ((runtimes.frames-1 * runtimes.avg) + runtime) / runtimes.frames 
}

const pattern_wrapper = (fn) => {
  return () => {
    const start = Date.now()
    ticks += 1
    leds.begin()
    fn()
    leds.end()
    handleRuntime(start)
  }
}

const from_first_to_last = () => {
  const ct96 = ticks % 96

  // if (ticks % 24 !== 0) return
  if (ct96 == 74) {
    blackout(config)
  } else if (ct96 == 1) {
    whiteEach(config, 0)
  } else if (ct96 == 62) {
    whiteEach(config, 35)
  } else if (ct96 >= 25 && ct96 <= 61) {
    const offset = ct96 - 25
    blackEach(config, offset)
    whiteEach(config, offset+1)
  }
}

const bladez = () => {
  config.groups.all.forEach((fixture, pos) => {
    patterns.bladez(fixture, ticks, pos % 3)
  })
}
const lines_out = () => {
  patterns.linesOut(config, ticks)
}

const snake_one = () => {
  config.groups.all.forEach((fixture, pos) => {
    patterns.snakeOne(fixture, ticks, pos % 2)
  })
}

const snake2 = () => {
  config.groups.all.forEach((fixture, pos) => {
    patterns.snake2(fixture, ticks, pos)
  })
}

const zoom_triangles_huespread = () => {
  config.groups.all.forEach((fixture, pos) => {
    patterns.zoomTriangle(fixture, ticks, pos)
  });
}


const zoom_triangles_nospread = () => {
  config.groups.all.forEach((fixture, pos) => {
    patterns.zoomTriangle(fixture, ticks, pos, false)
  });
}

const rotate_triangles = () => {
  const triangle_to_use = Math.floor((ticks / 40)) % config.groups.all.length
  patterns.whiten(
    config.groups.all[triangle_to_use],
    ticks
  )
}

const triforcer = () => {
  config.groups.all.forEach((fixture, pos) => {
    patterns.triforce(fixture, ticks, pos % 2 === 1)
  });
}

const clockers = () => {
  config.groups.all.forEach((fixture, pos) => {
    patterns.clocker(fixture, ticks, pos % 2 === 1)
  });
}

const clockers2 = () => {
  config.groups.all.forEach((fixture, pos) => {
    patterns.clocker2(fixture, ticks, pos % 2)
  });
}

const warpdrive = () => {
  config.groups.all.forEach((fixture, pos) => {
    patterns.warpdrive(fixture, ticks, pos % 6)
  });
}

const exit = () => {
  console.log('hello from exit.');
  blackout(config, () => {
    console.log('how did I do?: ', runtimes)
    console.log('blackin out.')
    process.exit(0)
  })
}

module.exports = {
  bladez: pattern_wrapper(bladez),
  clockers: pattern_wrapper(clockers),
  clockers2: pattern_wrapper(clockers2),
  from_first_to_last: pattern_wrapper(from_first_to_last),
  lines_out: pattern_wrapper(lines_out),
  rotate_triangles: pattern_wrapper(rotate_triangles),
  snake_one: pattern_wrapper(snake_one),
  snake2: pattern_wrapper(snake2),
  triforcer: pattern_wrapper(triforcer),
  warpdrive: pattern_wrapper(warpdrive),
  zoom_triangles_huespread: pattern_wrapper(zoom_triangles_huespread),
  zoom_triangles_nospread: pattern_wrapper(zoom_triangles_nospread),
  exit
}
