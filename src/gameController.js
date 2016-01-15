require("../public/js/commons/callbackHelper.js");
require("../public/js/games/stateMachine.js");
require("../public/js/games/solidPhysicObject.js");
require("../public/js/games/universalPhysic.js");
require("../public/js/gdie/hero.js");
require("../public/js/gdie/game.js");

var callFPS = require("./utils").callFPS;

module.exports = function(game, stateBuffer) {
  this.startGameLoop = function() {
    callFPS(game.update, 60)
  };

  this.newPlayer = function(playerId) {
    var hero = game.bornHero(playerId);
    stateBuffer.addHeroBorn(playerId);
    hero.listen("stateChange", function(newState, direction) {
      stateBuffer.addStateChange(playerId, newState, direction);
    });

    hero.physic().listen("update", function() {
      stateBuffer.addPhysicChange(playerId, this);
    });
    hero.init();
  };

  this.removePlayer = function(playerId) {
    stateBuffer.addHeroKilled(playerId);
    game.killHero(playerId);
  };

  this.heroAction = function(playerId, transition) {
    game.heroes[playerId].act(transition);
  };
};
