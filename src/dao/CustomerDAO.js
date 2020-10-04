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

  /**
   * Retorna o Consumidor conforme Id.
   *
   * @async
   * @param {int} id
   * @returns {Promise<Customer>}
   * @memberof CustomerDAO
   */
  async getById(id) {
    return Customer.findByPk(id);
  }

  /**
   * Retorna o Consumidor conforme E-mail.
   *
   * @async
   * @param {string} email
   * @returns {Promise<Customer>}
   * @memberof CustomerDAO
   */
  async getByEmail(email) {
    return Customer.findOne({where: {email}});
  } 
}

module.exports = CustomerDAO;