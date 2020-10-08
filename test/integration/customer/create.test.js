let HttpStatus = require("http-status");

let IntegrationTestServer = require("../../util/IntegrationTestServer");

before(async () => {
  await IntegrationTestServer.initialize();
});

describe("/challenge/customer", function() {

  let jwt;

  // @todo daniel remover
  // let supertest = supertest(this.server.express);
  // let expect = chai.expect;

  it("Customer: should create.", function(done) {
    let request = supertest.post("/challenge/customer")
      .send({
        name: "Test", 
        email: "test@test.com"
      })
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("email");
    }).should.notify(done);
  });

  it("Auth: should login.", function(done) {
    let request = supertest.post("/challenge/login")
      .send({
        email: "test@test.com"
      })
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.then(response => {
      jwt = response.body.jwt;
      expect(response.body).to.have.property("jwt");
    }).should.notify(done);
  });

  it("Customer: should get.", function(done) {
    let request = supertest.get("/challenge/customer")
      .set("Authorization", "Bearer " + jwt)
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("name", "Test");
      expect(response.body).to.have.property("email", "test@test.com");
    }).should.notify(done);
  });

  it("Customer: should update.", function(done) {
    let request = supertest.put("/challenge/customer")
      .set("Authorization", "Bearer " + jwt)
      .send({
        name: "Test Updated",
      })
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("email");
    }).should.notify(done);
  });

  it("Customer: should delete.", function(done) {
    let request = supertest.delete("/challenge/customer")
      .set("Authorization", "Bearer " + jwt)
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    expect(request).to.be.fulfilled.should.notify(done);
  });
});