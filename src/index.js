const inquirer = require('inquirer');
const fs = require('fs');
const config = require('./config')
const server = require('./server')

const {blackout} = require('./utils')
const patternCallers = require('./pattern-callers');

// this should be null usually - if set to something, we will boot up
// with that animation
let activePattern // = patternCallers.zoom_triangles_nospread
// use demo timer, i.e. switch patterns on an interval
const USE_TIMER = true
// how long is that interval, in ms
const DEMO_LENGTH = 15000

const DEFAULT_BPM = 150

const questions = [
  {
    name: 'pattern',
    message: 'Choose a pattern:',
    type: 'list',
    choices: ['update bpm', ...Object.keys(patternCallers)]
  }
];



const start = Date.now()
// the interval used for animations
let loop, framerate // = setInterval(triangle_patterns, 41)
let promptForBpm

/**
 * Update the bpm (by updating global value 'framerate')
 * Then reset the loop appropriately
 * @param {int} bpm  The updated bpm
 */
const updateBpm = (bpm) => {
  framerate = bpmToMs(bpm)
  console.log('using framerate:', framerate)
  
  if (activePattern) {
    clearInterval(loop)
    loop = setInterval(activePattern, framerate)
  }
}



const askQuestions = () => {
  inquirer.prompt(questions).then((answers) => {
    if (answers.pattern === 'update bpm') {
      return promptForBpm()
    }
    if (patternCallers[answers.pattern]) {
      activePattern = patternCallers[answers.pattern]
      blackout()
      clearInterval(loop)
      loop = setInterval(activePattern, framerate)
    }
    askQuestions()
  });
}

let lastPattern = -1
const nextPattern = () => {
  const patterns = Object.keys(patternCallers)
  console.log(patterns)
  let idx
  while (true) {
    // -1 so 'exit' isn't included
    idx = Math.floor(Math.random() * (patterns.length - 1))
    if (idx !== lastPattern) break
  }

  console.log(patterns[idx])
  activePattern = patternCallers[patterns[idx]]
  blackout()
  clearInterval(loop)
  loop = setInterval(activePattern, framerate)  
}
const timer = () => {
  demoTimer = setInterval(nextPattern, DEMO_LENGTH)
  nextPattern()
}

promptForBpm = () => {
  inquirer.prompt([{
    name: 'bpm',
    message: 'Type a bpm',
    type: 'input',
    validate: (fr) => {
      const rate = parseInt(fr, 10);
      return (rate > 0 && rate <= 300) ? true : 'Range 1-300 homie'
    },
    filter: (fr) => {
      return parseInt(fr, 10);
    }
  }]).then((answers) => {
    updateBpm(answers.bpm)
    askQuestions()
  })
}

/**
 * Convert bpm to the # of ms to run the animation at
 * @param {int} bpm The beats per minute
 * @returns {int} The ms equivalent
 */
const bpmToMs = (bpm) => {
  const FRAMES = 24 // # of frames per beat
  const FAC = 1 // slow it down; in the 1-4 range
  return 60000 * FAC / (24 * bpm)
}

// give server a bpm callback
server(updateBpm)

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ \\
// main loop starts here
blackout()
framerate = bpmToMs(DEFAULT_BPM)

if (activePattern) {
  clearInterval(loop)
  loop = setInterval(activePattern, framerate)
} else if (USE_TIMER) {
  timer()
} else {
  askQuestions()
}



// process.stdin.setRawMode(true);
// process.stdin.resume();

// process.removeAllListeners('SIGINT')

// process.stdin.on('data', loopKiller.bind(process, config));
process.on('SIGINT', () => {
  clearInterval(loop)
  patternCallers.exit()
  blackout()
  process.exit()
})
