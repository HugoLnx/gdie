module.exports = function(primus, client) {
  var self = this;
  var callbacks = LNXCommons.CallbackHelper.initializeFor(this);

  primus.save('public/lib/primus.js');

  primus.on("connection", function(spark) {
    console.log("connected", spark.id);
    client.push(spark);
    callbacks.emit("newPlayer", spark.id);

    spark.on("data", function(data) {
      callbacks.emit("heroAction", [data.id, data.transition]);
    });
  });

  primus.on("disconnection", function(spark) {
    console.log("disconnected", spark.id);
    client.remove(spark);
    callbacks.emit("removePlayer", spark.id);
  });
};
