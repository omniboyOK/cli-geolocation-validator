const mongo = require("mongodb").MongoClient;

mongo.connect(
  process.env.DATABASE,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  function (err, connection) {
    if (err) {
      console.log(err);
    }
    global.db = connection.db(database);
    console.log("%c Conectado a la base de datos", "color: green");
  }
);
