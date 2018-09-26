var options = {
    port: 6454,
    sendAll: true
}
 
var artnet = require('artnet')(options);
artnet.setHost('169.254.18.2');

module.exports = artnet
