var dgram = require('dgram');
var express = require('express');
var app = express();

// UDP API to gather data from string encoder
var srv = dgram.createSocket("udp4");
srv.on("message", function (msg, rinfo) {
    console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
  });

srv.on("listening", function () {
    var address = srv.address();
    console.log("server listening " + address.address + ":" + address.port);
  });

srv.on('error', function (err) {
    console.error(err);
    process.exit(0);
  });

srv.bind(3000);

// Serve graphs via HTTP
app.use(express.static('public'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
