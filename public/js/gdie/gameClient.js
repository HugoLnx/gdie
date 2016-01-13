(function(namespace) {
  var Callbacks = LNXCommons.CallbackHelper;

  namespace.GameClient = function() {
    var callbacks = Callbacks.initializeFor(this);
    var primus = Primus.connect({manual: true});

    this.sendHeroAction = function(playerId, action) {
      primus.write({id: playerId, transition: action});
    };

    primus.on("data", function(data) {
      if(data.evt === "stateChange") {
        callbacks.emit("stateChange", [data.id, data]);
      } else if(data.evt === "physic") {
        callbacks.emit("physicChange", [data.id, data]);
      } else if(data.evt === "bornHero") {
        callbacks.emit("bornHero", [data.id, data.mainHero]);
      } else if(data.evt === "killHero") {
        callbacks.emit("killHero", data.id);
      } else {
        console.log("dont recognize event: ", data);
      }
    });

    this.openConnection = function() {
      primus.open();
    };
  };
}(typeof(LNXGdie) === "undefined" ? LNXGdie = {} : LNXGdie));
