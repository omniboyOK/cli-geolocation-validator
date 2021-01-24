const assert = require("chai").assert;
const TestinService = require("../Service/TestService");
const GeoController = require("../Controller/GeoController");

describe("GeoController", function () {
  before(function (done) {
    TestinService.connectReadOnly(done);
  });

  it("GET Locality: CABA - VILLA LUGANO", async function () {
    let point = { lat: -34.6798778, lon: -58.4529118 };
    let result = await GeoController.getLocality(point, "CABA");
    assert.equal(result, "VILLA LUGANO");
  });

  it("GET Locality: CABA - DEVOTO", async function () {
    let point = { lat: -34.6033135, lon: -58.5183329 };
    let result = await GeoController.getLocality(point, "CABA");
    assert.equal(result, "VILLA DEVOTO");
  });
  it("Search: Avenida Escalada", async function () {
    let results = await GeoController.getGeo("Avenida Escalada 4850");
    assert.isArray(results, "Result is not an array");
    assert.include(
      results[0].display_name,
      "Argentina",
      "Address isn't in Argentina"
    );
  });
  it("Search: null", async function () {
    let results = await GeoController.getGeo(null);
    assert.isArray(results, "Result is not an array");
  });

  it("Validate: Argentina en Argentina", async function () {
    let point = { lat: -34.6798778, lon: -58.4529118 }; // Avenida Escalada 4850
    let result = await GeoController.validateInCountry(point, "ARG");
    assert.equal(result, true, "Argentina Address is out of bonds");
  });

  it("Validate: Washington MultiPolygon", async function () {
    let point = { lat: 38.8949924, lon: -77.0365581 }; // Washington
    let result = await GeoController.validateInCountry(point, "USA");
    assert.equal(result, true, "Washington Address is out of bonds");
  });

  it("Validate: CAF Polygon", async function () {
    let point = { lat: 5.5802832, lon: 16.5490651 }; // Africa
    let result = await GeoController.validateInCountry(point, "CAF");
    assert.equal(result, true, "Address is out of bonds");
  });

  after(function (done) {
    TestinService.disconnect(done);
  });
});
