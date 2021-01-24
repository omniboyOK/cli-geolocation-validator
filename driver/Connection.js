const mongo = require("mongodb").MongoClient;

module.exports = {
  init: function (callback) {
    mongo.connect(
      "mongodb://127.0.0.1:27017/",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      function (err, connection) {
        if (err) {
          console.log(err);
        }
        global.db = connection.db("geolocation");
        console.log("Conectado a la base de datos\n");
        callback();
      }
    );
  },
};
