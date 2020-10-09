const HttpStatus = require("http-status");
const IntegrationTestServer = require("../util/IntegrationTestServer");

before(async () => {
  await IntegrationTestServer.initialize();
});

describe("/challenge/customer", function() {

  it("Customer: should create.", function(done) {
    let request = supertest.post("/challenge/customer")
      .send(helper.fakeCustomer)
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("name", helper.fakeCustomer.name);
      expect(response.body).to.have.property("email", helper.fakeCustomer.email);
    }).should.notify(done);
  });

  it("Customer: should not create if e-mail already exists.", function(done) {
    let request = supertest.post("/challenge/customer")
      .send(helper.fakeCustomer)
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.should.notify(done);
  });

  it("Customer: should get.", async function() {
    let authentication = await helper.login(helper.fakeCustomer);

    let request = supertest.get("/challenge/customer")
      .set("Authorization", "Bearer " + authentication.jwt)
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    return expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("name", helper.fakeCustomer.name);
      expect(response.body).to.have.property("email", helper.fakeCustomer.email);
    });
  });

  it("Customer: should update.", async function() {
    let authentication = await helper.login(helper.fakeCustomer);

    let request = supertest.put("/challenge/customer")
      .set("Authorization", "Bearer " + authentication.jwt)
      .send({name: "Test Updated"})
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    return expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("name", "Test Updated");
      expect(response.body).to.have.property("email", helper.fakeCustomer.email);
    });
  });

  it("Customer: should delete.", async function() {
    let authentication = await helper.login(helper.fakeCustomer);

    let request = supertest.delete("/challenge/customer")
      .set("Authorization", "Bearer " + authentication.jwt)
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    return expect(request).to.be.fulfilled;
  });
});