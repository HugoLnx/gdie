var eventBuilder = require("./eventBuilder.js");

module.exports = function() {
  var events = {};
  var isEmpty = true;
  this.addHeroBorn = function(playerId) {
    initPlayer(playerId);
    eventBuilder.bindBornHero(events[playerId], false);
    isEmpty = false;
  };

  this.addStateChange = function(playerId, newState, direction) {
    initPlayer(playerId);
    eventBuilder.bindStateChange(events[playerId], newState, direction);
    isEmpty = false;
  };

  this.addPhysicChange = function(playerId, physic) {
    initPlayer(playerId);
    eventBuilder.bindPhysicChange(events[playerId], physic);
    isEmpty = false;
  };

  this.addHeroKilled = function(playerId) {
    initPlayer(playerId);
    eventBuilder.bindKillHero(events[playerId]);
    isEmpty = false;
  };
  
  this.isNotEmpty = function() {
    return !isEmpty;
  };

  this.flush = function() {
    var flushed = events;
    events = {};
    isEmpty = true;
    return flushed
  };

  function initPlayer(playerId) {
    if(events[playerId] === undefined) {
      events[playerId] = {};
    }
  }
};
