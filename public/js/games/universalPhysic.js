(function(namespace) {
  var Callbacks = LNXCommons.CallbackHelper;

  namespace.UniversalPhysic = function() {
    var callbacks = Callbacks.initializeFor(this);
    var weakObjectId = 0;
    var weakObjects = {};
    var fixedObjects = [];

    this.push = function(obj) {
      if(obj.type === "fixed") {
        fixedObjects.push(obj);
      } else {
        weakObjects[weakObjectId] = obj;
        obj.id = weakObjectId;
        weakObjectId += 1;
      }
      obj.emitOnUniverse();
      callbacks.emit("objectPushed", obj);
    };

    this.remove = function(obj) {
      delete weakObjects[obj.id];
    };

    this.update = function() {
      for(var id in weakObjects) {
        weakObjects[id].update();
        applyTo(weakObjects[id]);
      }

      for(var id in weakObjects) {
        for(var j = 0; j < fixedObjects.length; j++) {
          var weak = weakObjects[id];
          var fixed = fixedObjects[j];
          treatCollision(weak.collides(fixed));
        }
      }

      for(var id in weakObjects) {
        weakObjects[id].verifyFalling();
        weakObjects[id].emitUpdated();
        callbacks.emit("objectUpdated", weakObjects[id]);
      }
    };

    function treatCollision(collision) {
      if (!collision) return;
      var weak = collision.solidWeakObject;
      var fixed = collision.solidFixedObject;
      
      var topOut = weak.y - fixed.y;
      var bottomOut = (fixed.y-fixed.height) - (weak.y-weak.height);
      var leftOut = fixed.x - weak.x;
      var rightOut = (weak.x+weak.width) - (fixed.x+fixed.width);

      if(topOut >= Math.max(bottomOut, leftOut, rightOut)) {
        weak.y = fixed.y + weak.height;
        weak.stopMovementToDownwards();
        weak.emitBlockedBottom(fixed);
      } else if(leftOut >= Math.max(topOut, bottomOut, rightOut)) {
        weak.x = fixed.x - weak.width;
        weak.stopMovementToRight();
        weak.emitBlockedRight(fixed);
      } else if(rightOut >= Math.max(topOut, bottomOut, leftOut)) {
        weak.stopMovementToLeft();
        weak.x = fixed.x + fixed.width;
        weak.emitBlockedLeft(fixed);
      } else if(bottomOut >= Math.max(topOut, leftOut, rightOut)) {
        weak.stopMovementToUpwards();
        weak.y = fixed.y - fixed.height;
        weak.emitBlockedTop(fixed);
      }
    }

    function applyTo(obj) {
      var gravity = -0.05;
      var horizontalResistence = 0.03;
      if(obj.vel.y > -10) {
        obj.force(0, gravity);
      } else {
        obj.forceToZero(0, 10);
      }
      obj.forceToZero(0.03, 0);
    };
  };
}(typeof(LNXGames) === "undefined" ? LNXGames = {} : LNXGames));
