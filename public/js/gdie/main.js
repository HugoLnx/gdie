(function(){
  var client = new LNXGdie.GameClient();

  PIXI.loader
   .add("./img/metroid2.png")
   .load(new LNXGdie.GameLoop(client).start);
}());
