const HttpStatus = require("http-status");
const IntegrationTestServer = require("../util/IntegrationTestServer");

before(async () => {
  await IntegrationTestServer.initialize();
});

describe("/challenge/customer", function() {

  let customer;

  before(async () => {
    customer = await helper.createCustomer(helper.fakeCustomer);
  });

  after(async () => {
    await helper.deleteCustomer(helper.fakeCustomer);
  })

  it("Auth: should login.", function(done) {
    let request = supertest.post("/challenge/login")
      .send({"email": customer.email})
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("jwt");
    }).should.notify(done);
  });

  it("Auth: should not login with invalid credentials.", function(done) {
    let request = supertest.post("/challenge/login")
      .send({"email": "wrong@test.com"})
      .expect(HttpStatus.UNAUTHORIZED)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.should.notify(done);
  });
});