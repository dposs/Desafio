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

  /**
   * Retorna o Consumidor conforme Id.
   *
   * @async
   * @param {int} id
   * @returns {Promise<Customer>}
   * @memberof CustomerService
   */
  async getById(id) {
    return this.dao.getById(id);
  }

  /**
   * Retorna o Consumidor conforme E-mail.
   *
   * @async
   * @param {string} email
   * @returns {Promise<Customer>}
   * @memberof CustomerService
   */
  async getByEmail(email) {
    return this.dao.getByEmail(email);
  } 
}

module.exports = CustomerService;