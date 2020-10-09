const mock = require("mock-require");
const sinon = require("sinon");

const ProductService = require("../src/service/ProductService");

ProductService.prototype.getById = sinon.stub()
  .withArgs("1")
  .resolves({
    "id": "1",
    "title": "Integration Test Product",
    "brand": "Integration Test Brand",
    "image": "Integration Test Image",
    "price": 1
  });

mock("../src/service/ProductService", ProductService);