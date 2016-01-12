var SlavesClient = require("./slavesClient.js").SlavesClient;

exports.MasterSocketServer = function(primus) {
  var self = this;
  var callbacks = LNXCommons.CallbackHelper.initializeFor(this);

  // TODO: Think better solution to slaves client
  var client = new SlavesClient(primus);

  primus.save('public/lib/primus.js');

  primus.on("connection", function(spark) {
    console.log("connected", spark.id);
    client.push(spark);
    callbacks.emit("newPlayer", [spark.id, client]);

    spark.on("data", function(data) {
      callbacks.emit("heroAction", [data.id, data.transition]);
    });
  });

  primus.on("disconnection", function(spark) {
    console.log("disconnected", spark.id);
    client.remove(spark);
    callbacks.emit("removePlayer", [spark.id, client]);
  });
};
