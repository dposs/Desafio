let AuthService = require("../../src/service/AuthService");
let Customer = require("../../src/model/sequelize/Customer");

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