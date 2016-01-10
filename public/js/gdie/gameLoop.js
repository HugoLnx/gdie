(function(namespace) {
  var Game = LNXGdie.Game;
  var Controls = LNXGames.Controls;
  var SamusGraphics = LNXGdie.HeroGraphics;

  namespace.GameLoop = function(primus) {
    var container = null;
    var renderer = null;
    var self = this;
    var game = null;
    var graphics = [];
    var mainHero = null;

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
        obj.sprite = sprite;
        if(obj.type !== "weak") {
          container.addChild(sprite);
        }
      });
      game.universe.listen("objectUpdated", function(obj) {
        obj.sprite.x = obj.x;
        obj.sprite.y = 480-obj.y;
      });

      primus.on("data", function(data) {
        var hero = game.heroes[data.id];
        if(data.evt === "stateChange") {
          hero.set(data);
        } else if(data.evt === "physic") {
          game.heroes[data.id].physic().set(data);
        } else if(data.evt === "bornHero") {
          console.log(data);
          if(data.mainHero) {
            mainHero = newHero(data.id);
          } else {
            newHero(data.id)
          }
        } else if(data.evt === "killHero") {
          rmHero(data.id);
        } else {
          console.log("dont recognize event: ", data);
        }
      });

      game.init();
      requestAnimationFrame(self.update);
    };
    
    function newHero(id) {
      var samusGraphics = new SamusGraphics(container);
      var samus = game.bornHero();
      samus.id = id;
      samus.listen("stateChange", function(newState, direction) {
        samusGraphics.changeAnimationToCompatibleWithState(newState, direction);
      });

      samus.physic().listen("update", function() {
        //console.log(samus.id, this.x, this.y);
        samusGraphics.update(this.x-10, 480-this.y);
      });
      samus.init();
      game.heroes[samus.id] = samus;
      graphics[samus.id] = samusGraphics;
      return samus;
    };

    function rmHero(id) {
      game.heroes[id].physic().update = function(){};
      delete game.heroes[id];
      graphics[id].hide();
      delete graphics[id];
    }

    this.update = function() {
      requestAnimationFrame(self.update);
      if(Controls.isPressed("right")) {
        sendAct("moveRight");
      } else if(Controls.isPressed("left")) {
        sendAct("moveLeft");
      } else {
        sendAct("stop");
      }

      if(Controls.wasPressed("up")) {
        sendAct("jump");
      }

      if(Controls.wasReleased("up")) {
        sendAct("fall");
      }

      game.update();
      renderer.render(container);
    };

    function sendAct(name) {
      if(mainHero) {
        primus.write({id: mainHero.id, transition: name});
        mainHero.act(name);
      }
    };
  };
}(typeof(LNXGdie) === "undefined" ? LNXGdie = {} : LNXGdie));
