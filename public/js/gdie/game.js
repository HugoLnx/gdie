(function(namespace) {
  var SolidPhysicObject = LNXGames.SolidPhysicObject;
  var UniversalPhysic = LNXGames.UniversalPhysic;
  var Samus = LNXGdie.Hero;
  var Controls = LNXGames.Controls;

  namespace.Game = function() {
    var self = this;
    var samus = null;
    var universe = null;
    var container = new PIXI.Container();
    var renderer = PIXI.autoDetectRenderer(640, 480, {
      backgroundColor: 0x004020
    });

    this.init = function() {
      universe = new UniversalPhysic(container);
      samus = new Samus(100, 480, container, universe);
      universe.push(new SolidPhysicObject(150, 200, 100, 20, "fixed")); // ground
      universe.push(new SolidPhysicObject(200, 350, 100, 20, "fixed")); // ground
      universe.push(new SolidPhysicObject(450, 400, 100, 20, "fixed")); // ground
      universe.push(new SolidPhysicObject(20, 100, 600, 20, "fixed")); // ground
      document.body.appendChild(renderer.view);

      requestAnimationFrame(self.update);
    };

    this.update = function() {
      requestAnimationFrame(self.update);
      if(Controls.isPressed("right")) {
        samus.act("moveRight");
      } else if(Controls.isPressed("left")) {
        samus.act("moveLeft");
      } else {
        samus.act("stop");
      }

      if(Controls.wasPressed("up")) {
        samus.act("jump");
      }

      if(Controls.wasReleased("up")) {
        samus.act("fall");
      }

      universe.update();
      samus.update();
      renderer.render(container);
    };
  };
}(LNXGdie = window.LNXGdie || {}));
