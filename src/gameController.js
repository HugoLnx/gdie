require("../public/js/commons/callbackHelper.js");
require("../public/js/games/stateMachine.js");
require("../public/js/games/solidPhysicObject.js");
require("../public/js/games/universalPhysic.js");
require("../public/js/gdie/hero.js");
require("../public/js/gdie/game.js");

var callFPS = require("./utils").callFPS;

module.exports = function(game, statesBuffer) {
  this.startGameLoop = function() {
    callFPS(game.update, 60)
  };

  // use slavesController instead of client
  this.newPlayer = function(playerId) {
    var hero = game.bornHero(playerId);
    hero.listen("stateChange", function(newState, direction) {
      client.sendStateChange(playerId, newState, direction);
    });

    hero.physic().listen("update", function() {
      client.sendPhysicChange(playerId, this.x, this.y, this.vel, this.accel);
    });
    hero.init();
  };

  this.removePlayer = function(playerId) {
    game.killHero(playerId);
  };

  this.heroAction = function(playerId, transition) {
    game.heroes[playerId].act(transition);
  };
};
