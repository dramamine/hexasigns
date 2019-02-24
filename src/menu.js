const inquirer = require('inquirer');
const fs = require('fs');
const config = require('./config')

const {blackout} = require('./utils')
const patternCallers = require('./pattern-callers');


const questions = [
  {
    name: 'pattern',
    message: 'Choose a pattern:',
    type: 'list',
    choices: ['update bpm', ...Object.keys(patternCallers)]
  }
];



const start = Date.now()
let loop // = setInterval(triangle_patterns, 41)
let framerate = 24

let updateBpm


const askQuestions = () => {
  inquirer.prompt(questions).then((answers) => {
    if (answers.pattern === 'update bpm') {
      return updateBpm()
    }
    if (patternCallers[answers.pattern]) {
      loop = null
      loop = setInterval(patternCallers[answers.pattern], 1000/framerate)
    }
    askQuestions()
  });
}

updateBpm = () => {
  inquirer.prompt([{
    name: 'framerate',
    message: 'Type a framerate',
    type: 'input',
    validate: (fr) => {
      const rate = parseInt(fr, 10);
      return (rate > 0 && rate <= 300) ? true : 'Range 1-300 homie'
    },
    filter: (fr) => {
      return parseInt(fr, 10);
    }
  }]).then((answers) => {
    framerate = answers.framerate
    askQuestions()
  })
}

blackout()
loop = setInterval(patternCallers.triforcer, 1000/framerate)
askQuestions()

// process.stdin.setRawMode(true);
// process.stdin.resume();


// process.stdin.on('data', loopKiller.bind(process, config));
process.on('SIGINT', () => {
  clearInterval(loop)
  patternCallers.exit()
})
