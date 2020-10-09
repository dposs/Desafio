const mock = require("mock-require");
const sinon = require("sinon");

const AuthService = require("../../../src/service/AuthService");
const ProductService = require("../../../src/service/ProductService");

const Customer = require("../../../src/model/sequelize/Customer");

/**
 * Helper dos Testes de Integração.
 *
 * @class IntegrationTestHelper
 */
class IntegrationTestHelper {

  /**
   * Cria uma nova instancia de IntegrationTestHelper.
   *
   * @memberof IntegrationTestHelper
   */
  constructor() {
    this.authService = new AuthService();

    /**
     * Fakes
     */

    this.fakeCustomer = {
      name: "Integration Test",
      email: "integration@test.com"
    };

    this.fakeProduct = {
      "id": "1",
      "title": "Integration Test Product",
      "brand": "Integration Test Brand",
      "image": "Integration Test Image",
      "price": 1
    };
  }

  /**
   * Configuração de Mocks.
   *
   * @static
   * @memberof IntegrationTestHelper
   */
  static mock() {
    let getById = sinon.stub(ProductService.prototype, "getById");

    getById.withArgs("1").resolves({
      "id": "1",
      "title": "Integration Test Product",
      "brand": "Integration Test Brand",
      "image": "Integration Test Image",
      "price": 1
    });

    getById.withArgs("unknown").resolves(null);

    mock("../../../src/service/ProductService", ProductService);
  }

  /**
   * Cria um Customer.
   *
   * @async
   * @param {JSON} customer
   * @returns {Promise<Customer>}
   * @memberof IntegrationTestHelper
   */
  async createCustomer(customer) {
    return Customer.create(customer).then(customer => customer.get({plain: true}));
  }

  /**
   * Exclui um Customer.
   *
   * @async
   * @param {Customer} customer
   * @returns {Promise}
   * @memberof IntegrationTestHelper
   */
  async deleteCustomer(customer) {
    return Customer.destroy({where: {email: customer.email}, force: true});
  }

  /**
   * Retorna o Token JWT para o Customer.
   *
   * @param {Customer} customer
   * @returns
   * @memberof IntegrationTestHelper
   */
  login(customer) {
    return this.authService.login(customer);
  }
}

module.exports = IntegrationTestHelper;