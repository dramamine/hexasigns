var options = {
    port: 6454,
    sendAll: true
}

var artnet = require('artnet')(options);
artnet.setHost('127.0.0.1');

module.exports = artnet
