var express = require('express'),
    Primus = require("primus");

var GameController = require("./src/gameController.js");
var GameServer = require("./src/gameServer.js");
var ClientsChannel = require("./src/clientsChannel.js");

var app = express();
app.use(express.static('public'));

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  configWebsocketServerAttachedTo(server);

  console.log('Example app listening at http://%s:%s', host, port);
});

function configWebsocketServerAttachedTo(httpServer) {
  var primus = new Primus(httpServer, { parser: "JSON" } );
  var game = new LNXGdie.Game().init();
  var clientsChannel = new ClientsChannel(primus);
  var socketServer = new GameServer(primus, clientsChannel);
  var stateBuffer = new StateBuffer();
  var gameController = new GameController(game, stateBuffer);
  socketServer.listen("newPlayer", gameController.newPlayer);
  socketServer.listen("removePlayer", gameController.removePlayer);
  socketServer.listen("heroAction", gameController.heroAction);
  gameController.startGameLoop();
  updateLoop();
}

function updateLoop() {
};
