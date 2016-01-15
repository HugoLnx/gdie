var express = require('express'),
    Primus = require("primus");

var GameController = require("./src/gameController.js");
var GameServer = require("./src/gameServer.js");
var ClientsChannel = require("./src/clientsChannel.js");
var StateBuffer = require("./src/stateBuffer.js");

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
  new ClientsUpdater(clientsChannel, stateBuffer, game).startLoop();
}


var utils = require("./src/utils.js");
var eventBuilder = require("./src/eventBuilder.js");
function ClientsUpdater(clientsChannel, stateBuffer, game) {
  this.startLoop = function() {
    utils.callFPS(sendToClient, 60);
  };

  function sendToClient() {
    if(stateBuffer.isNotEmpty()) {
      var deltaPerClient = adaptToEachClient(stateBuffer.flush());
      clientsChannel.sendStateUpdate(deltaPerClient);
    }
  };

  function adaptToEachClient(deltaState) {
    var deltaPerClient = {"default": deltaState};

    for(var playerId in deltaState) {
      var playerEvents = deltaState[playerId];
      if(playerEvents.bornHero !== undefined) {
        deltaPerClient[playerId] = buildGameStateDeltaFromZeroTo(playerId);
      }
    }
    return deltaPerClient;
  }

  function buildGameStateDeltaFromZeroTo(playerId) {
    var deltaState = {};
    for(var heroId in game.heroes) {
      var hero = game.heroes[heroId];
      var events = {}
      eventBuilder.bindBornHero(events, heroId === playerId),
      eventBuilder.bindStateChange(events, hero.state(), hero.direction()),
      eventBuilder.bindPhysicChange(events, hero.physic())
      deltaState[hero.id] = events;
    }
    return deltaState;
  }
}
