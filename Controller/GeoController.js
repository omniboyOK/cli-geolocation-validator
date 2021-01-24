require("colors");
const Nominatim = require("nominatim-geocoder");
const geocoder = new Nominatim();
const turf = require("@turf/turf");
const pointInPolygon = require("@turf/boolean-point-in-polygon").default;

module.exports = {
  getCountry: function (country) {
    global.db
      .collection("countries")
      .findOne({ "properties.ISO_A3": country }, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          return result?.properties?.ADMIN || "Country was not found";
        }
      });
  },
  saveCountry: function (country) {
    global.db.collection("countries").save(country, function (err, result) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(
        `%c Country ${country.properties.ADMIN} saved`,
        "color: green"
      );
    });
  },
  saveLocality: function (locality) {
    global.db.collection("localities").save(locality, function (err, result) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Locality saved`.green);
    });
  },
  validateInCountry: async function (geolocation, country) {
    if (!geolocation || !geolocation.lat || !geolocation.lon || !country) {
      return "Invalid parameters";
    }
    let result = await global.db
      .collection("countries")
      .findOne({ "properties.ISO_A3": country });
    if (!result) {
      return "No results found";
    }
    let polygons = [];
    let point = turf.point([geolocation.lon, geolocation.lat]);
    if (result.geometry.type === "MultiPolygon") {
      result.geometry.coordinates.forEach((coor) => {
        polygons.push(turf.polygon(coor));
      });
    } else {
      polygons.push(turf.polygon(result.geometry.coordinates));
    }
    let isInside = false;

    polygons.forEach((polygon) => {
      if (pointInPolygon(point, polygon)) {
        isInside = true;
      }
    });
    return isInside;
  },
  getGeo: async function (address) {
    let results = await geocoder.search({ q: address });

    return results || [];
  },
  getLatLng: async function (address) {
    let result = await geocoder.search({ q: address });
    if (result) {
      return { lat: result?.lat, lng: result?.lng };
    } else {
      return "No results\n";
    }
  },
};
