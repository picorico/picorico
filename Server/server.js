var dgram = require('dgram');
var express = require('express');
var app = express();

var data = [10000];
var offset = 0;
var consumer = 0;

// UDP API to gather data from string encoder
var srv = dgram.createSocket("udp4");
srv.on("message", function (msg, rinfo) {
    var date = new Date();
    if (offset % 1000 == 0)
      offset = 0;
    data[offset] = { 'timestamp': date.getTime(), value: parseInt(msg) };
    offset++;
  });

srv.on ("listening", function () {
    var address = srv.address ();
    console.log ("server listening " + address.address + ":" + address.port);
  });

srv.on ('error', function (err) {
    console.error (err);
    process.exit (0);
  });

srv.bind (3000);

app.use(express.static('public'));

app.get('/data', function (req, res) {
  if (consumer < offset) {
    var buf = data.slice (consumer, offset);
  } else {
    var buf = data.slice (consumer, data.length);
    buf = buf.concat (data.slice(0, consumer));
  }
  consumer = offset;
  res.json (buf);
});

var server = app.listen (3002, function () {

    var host = server.address ().address;
    var port = server.address ().port;

    console.log ('Example app listening at http://%s:%s', host, port);

  });
