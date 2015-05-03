var dgram = require('dgram');

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
