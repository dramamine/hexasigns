const http = require('http')
const url = require('url')

const createBpmListener = (bpmCallback) => {
  const app = http.createServer((request, response) => {
    let query = {}
    try {
      query = url.parse(request.url, true).query
    } catch (e) {
      console.error(e)
    }

    if (query.bpm) {
      const bpm = parseInt(query.bpm, 10)
      if (bpm < 60 || bpm > 300) {
        response.writeHead(400, { "Content-Type": "text/html" })
      } else {
        bpmCallback(bpm)
        response.writeHead(200, { "Content-Type": "text/html" })
        response.write(`THANKS`)
      }
    } else {
      response.writeHead(406, { "Content-Type": "text/html" })
    }

    response.end()
  });
  
  app.listen(3000)
  console.log('BPM endpoint listening, ex. localhost:3000/?bpm=140')

}

module.exports = createBpmListener;
