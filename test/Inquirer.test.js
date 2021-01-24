const assert = require("chai").assert;
const TestinService = require("../Service/TestService");

describe("Bot Init", function () {
  before(function (done) {
    TestinService.connectReadOnly(done);
  });

  it("Conección a base de datos", function (done) {
    global.db
      .collection("cities")
      .findOne({ city: "Buenos Aires" }, function (err, result) {
        assert.equal(
          err,
          null,
          "La base de datos no esta respondiendo correctamente"
        );
        done();
      });
  });

  after(function (done) {
    TestinService.disconnect(done);
  });
});
