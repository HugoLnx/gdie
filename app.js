var express = require('express'),
    Primus = require("primus");

var GameController = require("./src/gameController.js").GameController;
var MasterSocketServer = require("./src/masterSocketServer.js").MasterSocketServer;

var app = express();
app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  configWebsocketServerAttachedTo(server);

  console.log('Example app listening at http://%s:%s', host, port);
});

function configWebsocketServerAttachedTo(httpServer) {
  var primus = new Primus(httpServer, { parser: "JSON" } );
  var game = new LNXGdie.Game().init();
  var socketServer = new MasterSocketServer(primus);
  var gameController = new GameController(game);
  socketServer.listen("newPlayer", gameController.newPlayer);
  socketServer.listen("removePlayer", gameController.removePlayer);
  socketServer.listen("heroAction", gameController.heroAction);
  gameController.startGameLoop();
}

