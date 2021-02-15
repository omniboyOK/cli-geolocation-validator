const mongo = require("mongodb").MongoClient;
const GeoJSON = require("geojson");
const data = require("../archive/countries.json");

mongo.connect(
  "mongodb://127.0.0.1:27017/geolocation",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  async function (err, connection) {
    if (err) {
      console.log(err);
    }
    console.log(`%c Conected to database`, "color: green");
    global.db = connection.db("geolocation");
    const parsed = await GeoJSON.parse(data, { Point: ["lat", "lng"] });
    console.log(parsed)
    parsed.properties.features.forEach((country) => {
      global.db.collection("countries").save(country);
      console.log(
        `%c Country ${country.properties.ADMIN} saved`,
        "color: green"
      );
    });
  }
);
