var express = require('express'),
    Primus = require("primus");

var gameLoop = require("./src/gameLoop.js");

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
  var sparks = {};

  primus.save('public/lib/primus.js');

  primus.on("connection", function(spark) {
    console.log("connected", spark.id);
    spark.write({evt: "bornHero", id: spark.id, mainHero: true});
    for(var id in sparks) {
      sparks[id].write({evt: "bornHero", id: spark.id, mainHero: false});
      spark.write({evt: "bornHero", id: id, mainHero: false});
    }
    sparks[spark.id] = spark;
    var samus = gameLoop.game.bornHero(spark.id);
    samus.listen("stateChange", function(newState, direction) {
      writeToAll({evt: "stateChange", id: spark.id, state: newState, direction: direction});
    });

    samus.physic().listen("update", function() {
      //console.log(spark.id, this.x, this.y);
      writeToAll({evt: "physic", id: spark.id, x: this.x, y: this.y, vel: this.vel, accel: this.accel});
    });
    samus.init();


    spark.on("data", function(data) {
      //console.log(data);
      gameLoop.game.heroes[data.id].act(data.transition);
    });
  });

  primus.on("disconnection", function(spark) {
    console.log("disconnected", spark.id);
    delete sparks[spark.id];
    writeToAll({evt: "killHero", id: spark.id});
    gameLoop.game.killHero(spark.id);
  });

  function writeToAll(data) {
    for(var id in sparks) {
      sparks[id].write(data);
    }
  }
}

gameLoop.start();
