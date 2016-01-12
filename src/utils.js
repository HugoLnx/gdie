// Ensure that the function will be called close to 60 times per second,
// without consuming too much CPU.
// Reference: http://timetocode.tumblr.com/post/71512510386/an-accurate-nodejs-game-loop-inbetween-settimeout
exports.callFPS = function(func, fps) {
  var millisPerFrame = 1000/fps;
  var previousTick = new Date();
  (function loop() {
    var deltaMillis = new Date() - previousTick;
    if(deltaMillis >= millisPerFrame) {
      previousTick = new Date();
      func();
      setTimeout(loop, millisPerFrame-2);
      return;
    }

    var millisMissing = millisPerFrame - (new Date() - previousTick);
    if(millisMissing <= 3) {
      setImmediate(loop);
      return;
    }

    setTimeout(loop, millisPerFrame-2);
  }());
};

// DEBUG
var deltaCalls = 0;
var lastTime = new Date();

function countCalls() {
  deltaCalls += 1;
  if((new Date() - lastTime) >= 1000) {
    console.log(deltaCalls);
    deltaCalls = 0;
    lastTime = new Date();
  }
};
