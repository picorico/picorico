var dgram = require('dgram');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use (bodyParser.json ());
app.use(bodyParser.urlencoded({ extended: true }));

// potentiometer
var data = [10000];
var offset = 0;
var consumer = 0;

// accelerometer
var data_acc = [10000];
var offset_acc = 0;
var consumer_acc = 0;

// UDP API to gather data from string encoder
var srv = dgram.createSocket("udp4");
srv.on("message", function (msg, rinfo) {
  var date = new Date();
  if (offset % 10000 == 0)
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
  if (consumer_acc < offset_acc) {
    var buf_acc = data_acc.slice (consumer_acc, offset_acc);
  } else {
    var buf_acc = data_acc.slice (consumer_acc, data_acc.length);
    buf_acc = buf_acc.concat (data_acc.slice(0, consumer_acc));
  }
  consumer = offset;
  consumer_acc = offset_acc;
  res.json ({ 'pot': buf, 'acc': buf_acc });
});

app.post('/send', function (req, res) {
  var content = req.body;
  var date = new Date();
  if (offset_acc % 10000 == 0)
    offset_acc = 0;
  data_acc[offset_acc] = { 'timestamp': date.getTime(), value: content };
  offset_acc++;
  res.send();
});

var server = app.listen (3002, function () {

    var host = server.address ().address;
    var port = server.address ().port;

    console.log ('Example app listening at http://%s:%s', host, port);

  });
