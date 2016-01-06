(function(namespace) {
  namespace.UniversalPhysic = function(container) {
    var objects = [];

    this.push = function(obj) {
      obj.sprite = new PIXI.Graphics();
      obj.sprite.beginFill(0x995555);
      obj.sprite.drawRect(0, 0, obj.width, obj.height);
      obj.sprite.endFill();
      //obj.sprite.alpha = 0.5;
      if(obj.type !== "weak") {
        container.addChild(obj.sprite);
      }
      objects.push(obj);
    };

    this.update = function() {
      for(var i = 0; i < objects.length; i++) {
        objects[i].update();
        applyTo(objects[i]);
      }

      for(var i = 0; i < objects.length-1; i++) {
        for(var j = i+1; j < objects.length; j++) {
          var obj1 = objects[i];
          var obj2 = objects[j];
          treatCollision(obj1.collides(obj2));
        }
      }

      for(var i = 0; i < objects.length; i++) {
        objects[i].verifyFalling();
        objects[i].sprite.x = objects[i].x;
        objects[i].sprite.y = 480-objects[i].y;
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
        weak.blockedBottom(fixed);
      } else if(leftOut >= Math.max(topOut, bottomOut, rightOut)) {
        weak.x = fixed.x - weak.width;
        weak.stopMovementToRight();
        weak.blockedRight(fixed);
      } else if(rightOut >= Math.max(topOut, bottomOut, leftOut)) {
        weak.stopMovementToLeft();
        weak.x = fixed.x + fixed.width;
        weak.blockedLeft(fixed);
      } else if(bottomOut >= Math.max(topOut, leftOut, rightOut)) {
        weak.stopMovementToUpwards();
        weak.y = fixed.y - fixed.height;
        weak.blockedTop(fixed);
      }
    }

    function applyTo(obj) {
      if(obj.type !== "fixed") {
        var gravity = -0.05;
        var horizontalResistence = 0.03;
        if(obj.vel.y > -10) {
          obj.force(0, gravity);
        } else {
          obj.forceToZero(0, 10);
        }
        obj.forceToZero(0.03, 0);
      }
    };
  };
}(LNXGames = window.LNXGames || {}));
