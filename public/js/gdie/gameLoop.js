(function(namespace) {
  var Game = LNXGdie.Game;
  var Controls = LNXGames.Controls;
  var HeroesController = LNXGdie.HeroesController;

  namespace.GameLoop = function(client) {
    var container = null;
    var renderer = null;
    var self = this;
    var game = null;
    var heroes = null;

    this.start = function() {
      container = new PIXI.Container();
      renderer = PIXI.autoDetectRenderer(640, 480, {
        backgroundColor: 0x004020
      });
      document.body.appendChild(renderer.view);

      game = new Game();
      game.universe.listen("objectPushed", function(obj) {
        var sprite = new PIXI.Graphics();
        sprite.beginFill(0x995555);
        sprite.drawRect(0, 0, obj.width, obj.height);
        sprite.endFill();
        sprite.x = obj.x;
        sprite.y = 480-obj.y;
        obj.sprite = sprite;
        if(obj.type !== "weak") {
          container.addChild(sprite);
        }
      });
      game.universe.listen("objectUpdated", function(obj) {
        obj.sprite.x = obj.x;
        obj.sprite.y = 480-obj.y;
      });

      heroes = new HeroesController(game, container, client);
      client.listen("stateChange", heroes.updateState);
      client.listen("physicChange", heroes.updatePhysic);
      client.listen("bornHero", heroes.create);
      client.listen("killHero", heroes.destroy);
      client.openConnection();

      game.init();
      requestAnimationFrame(self.update);
    };

    this.update = function() {
      requestAnimationFrame(self.update);
      var rightWasReleased = Controls.wasReleased("right");
      var leftWasReleased = Controls.wasReleased("left");
      if((rightWasReleased && Controls.isReleased("left")) ||
         (leftWasReleased && Controls.isReleased("right"))) {
        heroes.act("stop");
      }

      if(Controls.wasPressed("right") ||
          (Controls.isPressed("right") && leftWasReleased)) {
        heroes.act("moveRight");
      } else if(Controls.wasPressed("left") ||
          (Controls.isPressed("left") && rightWasReleased)) {
        heroes.act("moveLeft");
      }

      if(Controls.wasPressed("up")) {
        heroes.act("jump");
      }

      if(Controls.wasReleased("up")) {
        heroes.act("fall");
      }


      game.update();
      renderer.render(container);
    };
  };
}(typeof(LNXGdie) === "undefined" ? LNXGdie = {} : LNXGdie));
