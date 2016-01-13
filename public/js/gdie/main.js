(function(){
  var primus = Primus.connect({manual: true});

  PIXI.loader
   .add("./img/metroid2.png")
   .load(new LNXGdie.GameLoop(primus).start);
}());
