let HttpStatus = require("http-status");

let IntegrationTestServer = require("../../util/IntegrationTestServer");

before(async () => {
  await IntegrationTestServer.initialize();
});

describe("/auth-server/health-check", function() {
  
  it("Health Check: should respond with success.", function(done) {
    let request = supertest.get("/auth-server/health-check").send()
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("status").that.is.equal("OK");
      expect(response.body).to.have.property("ENV");
    }).should.notify(done);
  });
});