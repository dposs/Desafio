let CustomerDAO = require("../dao/CustomerDAO");

/**
 * Service de Consumidor.
 *
 * @class CustomerService
 */
class CustomerService {

  /**
   * Cria uma instancia de CustomerService.
   *
   * @memberof CustomerService
   */
  constructor() {
    this.dao = new CustomerDAO();
  }

  /**
   * Cria o Consumidor.
   *
   * @async
   * @param {Customer} customer
   * @returns {Promise<Customer>}
   * @memberof CustomerService
   */
  async create(customer) {
    return this.dao.create(customer);
  }

}

module.exports = CustomerService;