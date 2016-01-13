module.exports = function() {
  var sparks = {};

  this.push = function(spark) {
    // Notify new client its main hero
    spark.write({evt: "bornHero", id: spark.id, mainHero: true});
    
    // Notify the new connection the existent heroes
    for(var id in sparks) {
      spark.write({evt: "bornHero", id: id, mainHero: false});
    }

    // Notify the other clients the borned hero
    for(var id in sparks) {
      sparks[id].write({evt: "bornHero", id: spark.id, mainHero: false});
    }

    sparks[spark.id] = spark;
  };

  this.remove = function(spark) {
    delete sparks[spark.id];
    writeToAll({evt: "killHero", id: spark.id});
  };

  this.sendStateChange = function(playerId, newState, direction) {
    writeToAll({evt: "stateChange", id: playerId, state: newState, direction: direction});
  };

  this.sendPhysicChange = function(playerId, x, y, vel, accel) {
    writeToAll({evt: "physic", id: playerId, x: x, y: y, vel: vel, accel: accel});
  };

  function writeToAll(data) {
    for(var id in sparks) {
      sparks[id].write(data);
    }
  }
};
