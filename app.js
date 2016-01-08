var express = require('express'),
    Primus = require("primus");


var app = express();
app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  configWebsocketServerAttachedTo(server);

  console.log('Example app listening at http://%s:%s', host, port);
});

function configWebsocketServerAttachedTo(server) {
  var primus = new Primus(server, { parser: "JSON" } );

  primus.save('public/lib/primus.js');

  primus.on("connection", function(spark) {
    console.log("connected");

    spark.on("data", function(data) {
      console.log("received", data);
      spark.write({serverMessage: "Hello Browser!"});
    });
  });

  primus.on("disconnection", function() {
    console.log("disconnected");
  });

  primus.on("data", function(message) {
    console.log("message", message);
  });
}
