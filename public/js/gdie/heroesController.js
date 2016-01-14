(function(namespace) {
  var SamusGraphics = LNXGdie.HeroGraphics;

  namespace.HeroesController = function(game, container, client) {
    var heroes = game.heroes;
    var graphics = [];
    var mainHero = null;

    this.updateState = function(playerId, heroState) {
      heroes[playerId].set(heroState);
    };

    this.updatePhysic = function(playerId, physicProperties) {
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
