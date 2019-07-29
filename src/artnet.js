var options = {
    port: 6454,
    sendAll: true
}
 
var artnet = require('artnet')(options);
artnet.setHost('192.168.1.2');

module.exports = artnet
