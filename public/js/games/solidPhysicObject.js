(function(namespace) {
  var Callbacks = LNXCommons.CallbackHelper;

  namespace.SolidPhysicObject = function(x, y, width, height, type) {
    var callbacks = Callbacks.initializeFor(this);
    var self = this;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.vel = {x: 0, y: 0};
    var saved = {vel: {}};

    this.set = function(props) {
      this.x = props.x;
      this.y = props.y;
      this.vel = props.vel;
    };

    this.velocityX = function(newX) {
      this.vel.x = newX;
    };

    this.velocityXMin = function(newX) {
      if(this.vel.x < newX) this.velocityX(newX);
    };

    this.velocityXMax = function(newX) {
      if(this.vel.x > newX) this.velocityX(newX);
    };

    this.velocityY = function(newY) {
      this.vel.y = newY;
    };

    this.noForcesX = function() {
      this.vel.x = 0;
    };

    this.noForces = function() {
      this.vel.x = 0;
      this.vel.y = 0;
    };

    this.force = function(x, y) {
      this.vel.x += x;
      this.vel.y += y;
    };

    this.forceToZero = function(x, y) {
      var absX = Math.abs(this.vel.x) - x;
      var absY = Math.abs(this.vel.y) - y;
      absX = Math.max(0, absX);
      absY = Math.max(0, absY);
      this.vel.x = (this.vel.x<0 ? -1*absX : absX);
      this.vel.y = (this.vel.y<0 ? -1*absY : absY);
    };

    this.update = function() {
      this.x += this.vel.x;
      this.y += this.vel.y;
    };

    this.emitUpdated = function() {
      callbacks.emit("update");
    };

    this.emitOnUniverse = function() {
      callbacks.emit("onUniverse");
    };

    this.stopMovementToDownwards = function() {
      if(this.vel.y < 0) this.vel.y = 0;
    };

    this.stopMovementToUpwards = function() {
      if(this.vel.y > 0) this.vel.y = 0;
    };

    this.stopMovementToLeft = function() {
      if(this.vel.x < 0) this.vel.x = 0;
    };

    this.stopMovementToRight = function() {
      if(this.vel.x > 0) this.vel.x = 0;
    };

    this.emitBlockedBottom = function(objBlocking) {
      callbacks.emit("blockedBottom", objBlocking);
    };

    this.emitBlockedTop = function(objBlocking) {
      callbacks.emit("blockedTop", objBlocking);
    };

    this.emitBlockedRight = function(objBlocking) {
      callbacks.emit("blockedRight", objBlocking);
    };

    this.emitBlockedLeft = function(objBlocking) {
      callbacks.emit("blockedLeft", objBlocking);
    };

    this.verifyFalling = function() {
      if(this.vel.y < 0) callbacks.emit("falling");
    }

    this.collides = function(obj2) {
      var topLeftCorner1 =     {x: this.x,            y: this.y};
      var topLeftCorner2 =     {x: obj2.x,            y: obj2.y};
      var bottomRightCorner1 = {x: this.x+this.width, y: this.y-this.height};
      var bottomRightCorner2 = {x: obj2.x+obj2.width, y: obj2.y-obj2.height};

      var noCollision = 
        (topLeftCorner1.x > bottomRightCorner2.x || bottomRightCorner1.x < topLeftCorner2.x) ||
        (topLeftCorner1.y < bottomRightCorner2.y || bottomRightCorner1.y > topLeftCorner2.y);

      if(noCollision) {
        return null;
      } else {
        var weak = this;
        var fixed = this;
        if(this.type === "fixed") {
          weak = obj2;
        } else {
          fixed = obj2;
        }

        return {solidWeakObject: weak, solidFixedObject: fixed}
      }
    };

    this.flushState = function() {
      var changed = (
        this.x !== saved.x ||
        this.y !== saved.y ||
        this.vel.x !== saved.vel.x ||
        this.vel.y !== saved.vel.y
      );

      saveState();
      return changed;
    };

    function saveState() {
      saved = {
        x: self.x, y: self.y,
        vel: {x: self.vel.x, y: self.vel.y}
      };
    };
  };
}(typeof(LNXGames) === "undefined" ? LNXGames = {} : LNXGames));
