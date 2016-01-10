(function(namespace) {
  var SolidPhysicObject = LNXGames.SolidPhysicObject;
  var UniversalPhysic = LNXGames.UniversalPhysic;
  var Samus = LNXGdie.Hero;

  namespace.Game = function() {
    var self = this;
    this.universe = new UniversalPhysic();
    this.heroes = {};

    this.init = function() {
      self.universe.push(new SolidPhysicObject(150, 200, 100, 20, "fixed")); // ground
      self.universe.push(new SolidPhysicObject(200, 350, 100, 20, "fixed")); // ground
      self.universe.push(new SolidPhysicObject(450, 400, 100, 20, "fixed")); // ground
      self.universe.push(new SolidPhysicObject(20, 100, 600, 20, "fixed")); // ground
      return this;
    };

    this.update = function() {
      self.universe.update();
      for(var id in self.heroes) {
        self.heroes[id].update();
      }
    };

    this.bornHero = function(id) {
      var samus = new Samus(100, 480);
      self.universe.push(samus.physic());
      samus.id = id;
      self.heroes[id] = samus;
      return samus;
    };

    this.killHero = function(id) {
      delete self.heroes[id];
    };
  };
}(typeof(LNXGdie) === "undefined" ? LNXGdie = {} : LNXGdie));
