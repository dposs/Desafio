const HttpStatus = require("http-status");
const IntegrationTestServer = require("../util/IntegrationTestServer");

before(async () => {
  await IntegrationTestServer.initialize();
});

describe("/challenge/product/favorite", function() {

  before(async () => {
    customer = await helper.createCustomer(helper.fakeCustomer);
  });

  after(async () => {
    await helper.deleteCustomer(helper.fakeCustomer);
  })

  it("Product: should add to favorites.", async function() {
    let authentication = await helper.login(helper.fakeCustomer);

    let request = supertest.post("/challenge/product/" + helper.fakeProduct.id + "/favorite")
      .send()
      .set("Authorization", "Bearer " + authentication.jwt)
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    return expect(request).to.be.fulfilled;
  });

  it("Product: should not add to favorites if product is already in favorites.", async function() {
    let authentication = await helper.login(helper.fakeCustomer);

    let request = supertest.post("/challenge/product/" + helper.fakeProduct.id + "/favorite")
      .send()
      .set("Authorization", "Bearer " + authentication.jwt)
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", /application\/json/);

    return expect(request).to.be.fulfilled;
  });

  it("Product: should not add to favorites if product doesn't exist.", async function() {
    let authentication = await helper.login(helper.fakeCustomer);

    let request = supertest.post("/challenge/product/unknown/favorite")
      .send()
      .set("Authorization", "Bearer " + authentication.jwt)
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", /application\/json/);

    return expect(request).to.be.fulfilled;
  });

  it("Product: should get all favorites.", async function() {
    let authentication = await helper.login(helper.fakeCustomer);

    let request = supertest.get("/challenge/product/favorite")
      .set("Authorization", "Bearer " + authentication.jwt)
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    return expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.be.an("array").that.deep.includes(helper.fakeProduct);
    });
  });

  it("Product: should remove from favorites.", async function() {
    let authentication = await helper.login(helper.fakeCustomer);

    let request = supertest.delete("/challenge/product/" + helper.fakeProduct.id + "/favorite")
      .send()
      .set("Authorization", "Bearer " + authentication.jwt)
      .expect(HttpStatus.OK)
      .expect("Content-Type", /application\/json/);

    return expect(request).to.be.fulfilled;
  });
});