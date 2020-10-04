let DataSource = require("../util/DataSource");

let Customer = DataSource.getModel("Customer");

/**
 * Data Access Object (DAO) de Consumidor.
 *
 * @class CustomerDAO
 */
class CustomerDAO {
  
  /**
   * Cria o Consumidor.
   *
   * @async
   * @param {Customer} customer
   * @returns {Promise<Customer>}
   * @memberof CustomerDAO
   */
  async create(customer) {
    return Customer.create(customer);
  }
}

module.exports = CustomerDAO;