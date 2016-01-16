(function(namespace) {
  var SamusGraphics = LNXGdie.HeroGraphics;

  namespace.HeroesController = function(game, container, client) {
    var ignoreServer = false;
    var heroes = game.heroes;
    var graphics = [];
    var mainHero = null;

    this.updateState = function(playerId, heroState) {
      if(ignoreServer) return;
      heroes[playerId].set(heroState);
    };

    this.updatePhysic = function(playerId, physicProperties) {
      if(ignoreServer) return;
      var data = physicProperties;
      var lat = client.latency() * 0.06;
      data.vel.x += data.vel.x*lat
      data.vel.y += data.vel.y*lat
      heroes[playerId].physic().set(physicProperties);
    };

    this.create = function(playerId, isMainHero) {
      var hero = newHero(playerId);
      heroes[playerId] = hero;
      if(isMainHero) mainHero = hero;
    };

    this.destroy = function(playerId) {
      game.killHero(playerId);
      graphics[playerId].destroy();
      delete graphics[playerId];
    };

    this.act = function(action) {
      if(mainHero) {
        client.sendHeroAction(mainHero.id, action)
        ignoreServer = true;
        setTimeout(function() {
          ignoreServer = false;
        }, client.latency());
        mainHero.act(action);
      }
    };
    
    function newHero(id) {
      var samusGraphics = new SamusGraphics(container);
      var samus = game.bornHero();
      samus.id = id;
      samus.listen("stateChange", function(newState, direction) {
        samusGraphics.changeAnimationToCompatibleWithState(newState, direction);
      });

      samus.physic().listen("update", function() {
        samusGraphics.update(this.x-10, 480-this.y);
      });
      samus.init();
      graphics[samus.id] = samusGraphics;
      return samus;
    };
  };
}(typeof(LNXGdie) === "undefined" ? LNXGdie = {} : LNXGdie));
