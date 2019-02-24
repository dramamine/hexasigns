const inquirer = require('inquirer');
const fs = require('fs');
const config = require('./config')
const {setColor, hexToRgb, getGradients, blackout} = require('./utils')
const {hslToRgb} = require('./color-conversion')
const {basicTriangle, zoomTriangle, whiten, whiteEach, blackEach, linesOut, triforce} = require('./triangle-patterns');

// how many frames have passed?
let ticks = 0

const from_first_to_last = () => {
  ticks += 1

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

const lines_out = () => {
  ticks += 1
  linesOut(config, ticks)
}

const zoom_triangles_huespread = () => {
  ticks += 1
  config.groups.all.forEach((fixture, pos) => {
    zoomTriangle(fixture, ticks, pos)
  });
}


const zoom_triangles_nospread = () => {
  ticks += 1
  config.groups.all.forEach((fixture, pos) => {
    zoomTriangle(fixture, ticks, pos, false)
  });
}

const rotate_triangles = () => {
  ticks += 1
  const triangle_to_use = Math.floor((ticks / 40)) % config.groups.all.length
  whiten(
    config.groups.all[triangle_to_use],
    ticks
  )
}

const triforcer = () => {
  ticks += 1
  config.groups.all.forEach((fixture, pos) => {
    triforce(fixture, ticks, pos % 2 === 1)
  });
}

const exit = () => {
  blackout(config, () => {
    console.log('blackin out.');
    process.exit(0)
  })
}

module.exports = {
  triforcer,
  from_first_to_last,
  zoom_triangles_huespread,
  zoom_triangles_nospread,
  rotate_triangles,
  lines_out,
  exit
}
