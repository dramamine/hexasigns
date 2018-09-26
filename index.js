var options = {
    // iface: '169.254.18.31', // or 18=>10?
    // iface: '169.254.18.1', // or 18=>10?
    // iface: '255.255.0.0', // or 18=>10?
    // host: '169.254.18.2', // or 18=>10?
    port: 6454,
    sendAll: true
}
 
var artnet = require('artnet')(options);
 artnet.setHost('169.254.18.2');

// artnet.set([9, 1], [10, 20, 30]);
// artnet.set([1, 1], [10, 20, 30]);

// for(let port=1; port<9999; port++) {
//   artnet.setPort(port);
//   console.log("trying port:", port);
for(let i=0; i<510; i++) {
  // artnet.set(i, 255);
  artnet.set(1, i, 0);

  // artnet.set(8, i, 255);
  // artnet.set(9, i, 255);
}
// }




console.log('set some stuff..');
// set channel 1 to 255 and disconnect afterwards.
// artnet.set(1, 255, function (err, res) {
//   console.log(err);
//   console.log(res);
//   artnet.close();
// });
