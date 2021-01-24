const assert = require("chai").assert;
const TestinService = require("../Service/TestService");
const GeoController = require("../Controller/GeoController");

describe("GeoController", function () {
  before(function (done) {
    TestinService.connectReadOnly(done);
  });

  it("Search: Avenida Escalada", async function () {
    let results = await GeoController.getGeo("Gregorio de laferrere 4958");
    assert.isArray(results, "La busqueda no devolvio un array");
    assert.include(
      results[0].display_name,
      "Argentina",
      "La direccion no dice Argentina"
    );
  });

  it("Search: null", async function () {
    let results = await GeoController.getGeo(null);
    assert.isArray(results, "La busqueda no devolvio un array");
  });

  it("Validate: Argentina en Argentina", async function () {
    this.timeout(25000);
    let point = { lat: -34.65523542857143, lon: -58.482973 }; // Gregorio de laferrere 4958
    let result = await GeoController.validateInCountry(point, "ARG");
    assert.equal(result, true, 'Argentina no puede estar fuera de cobertura');
  });

  it("Validate: Washington MultiPolygon", async function () {
    let point = { lat: 38.8949924, lon: -77.0365581 }; // Washington
    let result = await GeoController.validateInCountry(point, "USA");
    assert.equal(result, true, 'Washington no puede ser fuera de USA');
  });

  it("Validate: CAF Polygon", async function () {
    let point = { lat: 5.5802832, lon: 16.5490651 }; // Africa
    let result = await GeoController.validateInCountry(point, "CAF");
    assert.equal(result, true, 'Fuera de cobertura');
  });

  after(function (done) {
    TestinService.disconnect(done);
  });
});
