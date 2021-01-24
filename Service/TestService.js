const mongo = require("mongodb").MongoClient;

let _connection = null;

module.exports = {
  connectReadOnly: function (done) {
    mongo.connect(
      "mongodb://127.0.0.1:27017/geolocation",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      function (err, connection) {
        global.db = connection.db("geolocation");
        _connection = connection;
        done();
      }
    );
  },
  disconnect: function (done) {
    _connection.close(function () {
      done();
    });
  },
};
