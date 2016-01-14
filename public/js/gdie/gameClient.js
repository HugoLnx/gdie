(function(namespace) {
  var Callbacks = LNXCommons.CallbackHelper;

  namespace.GameClient = function() {
    var callbacks = Callbacks.initializeFor(this);
    var primus = Primus.connect({manual: true});

    this.sendHeroAction = function(playerId, action) {
      primus.write({id: playerId, transition: action});
    };

    primus.on("data", function(data) {
      for(var playerId in data) {
        var playerData = data[playerId];
        emitEventFor(playerId, playerData);
      }
    });

    this.openConnection = function() {
      primus.open();
    };

    function emitEventFor(playerId, data) {
      if(data.evt === "stateChange") {
        callbacks.emit("stateChange", [playerId, data]);
      } else if(data.evt === "physic") {
        callbacks.emit("physicChange", [playerId, data]);
      } else if(data.evt === "bornHero") {
        callbacks.emit("bornHero", [playerId, data.mainHero]);
      } else if(data.evt === "killHero") {
        callbacks.emit("killHero", data.id);
      } else {
        console.log("dont recognize event: ", data);
      }
    }
  };
}(typeof(LNXGdie) === "undefined" ? LNXGdie = {} : LNXGdie));
