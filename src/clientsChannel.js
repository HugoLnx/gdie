module.exports = function() {
  var sparks = {};

  this.push = function(spark) {
    sparks[spark.id] = spark;
  };

  this.remove = function(spark) {
    delete sparks[spark.id];
  };

  this.sendStateUpdate = function(statePerPlayer) {
    for(var id in sparks) {
      var playerDeltaState = statePerPlayer[id];
      if(playerDeltaState) {
        sparks[id].write(playerDeltaState);
      } else {
        sparks[id].write(statePerPlayer["default"]);
      }
    }
  };
};
