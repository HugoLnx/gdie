exports.bindBornHero = function(events, mainHero) {
  events.bornHero = {mainHero: mainHero};
};

exports.bindStateChange = function(events, newState, direction) {
  events.stateChange = {state: newState, direction: direction};
};

exports.bindPhysicChange = function(events, physic) {
  events.physicChange = {x: physic.x, y: physic.y, vel: physic.vel, accel: physic.accel};
};

exports.bindKillHero = function(events) {
  events.killHero = true;
  delete events.physicChange;
  delete events.stateChange;
  delete events.bornHero;
};
