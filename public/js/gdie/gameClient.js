(function(namespace) {
  var Callbacks = LNXCommons.CallbackHelper;

  namespace.GameClient = function() {
    var callbacks = Callbacks.initializeFor(this);
    var primus = Primus.connect({manual: true});

    this.sendHeroAction = function(playerId, action) {
      primus.write(action);
    };

    primus.on("data", function(data) {
      for(var playerId in data) {
        var playerEvents = data[playerId];
        var bornEvent = playerEvents.bornHero;
        if(bornEvent) {
          delete playerEvents.bornHero;
          emitEventFor(playerId, 'bornHero', bornEvent);
        }
        for(evt in playerEvents) {
          emitEventFor(playerId, evt, playerEvents[evt]);
        }
      }
    });

    this.latency = function() {
      return primus.latency;
    };

    this.openConnection = function() {
      primus.open();
    };

    function emitEventFor(playerId, evt, data) {
      if(evt === "stateChange") {
        callbacks.emit("stateChange", [playerId, data]);
      } else if(evt === "physicChange") {
        callbacks.emit("physicChange", [playerId, data]);
      } else if(evt === "bornHero") {
        callbacks.emit("bornHero", [playerId, data.mainHero]);
      } else if(evt === "killHero") {
        callbacks.emit("killHero", playerId);
      } else {
        console.log("dont recognize event: ", evt, data);
      }
    }
  };
}(typeof(LNXGdie) === "undefined" ? LNXGdie = {} : LNXGdie));
