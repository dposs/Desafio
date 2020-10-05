const i18next = require("i18next");

const CustomerDAO = require("../dao/CustomerDAO");
const InvalidPropertyError = require("../error/InvalidPropertyError");

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
    let error = new InvalidPropertyError();

    if (!customer.name) error.addProperty("name", i18next.t("message:mandatory"));
    if (!customer.email) error.addProperty("email", i18next.t("message:mandatory"));

    let exists = await this.getByEmail(customer.email);
    if (exists) error.addProperty("email", "E-mail já cadastrado.");

    if (error.hasProperties()) throw error;

    return this.dao.create(customer);
  }

  /**
   * Modifica o Consumidor.
   *
   * @async
   * @param {Customer} customer
   * @returns {Promise<Customer>}
   * @memberof CustomerService
   */
  async update(customer) {
    return this.dao.update(customer);
  }

  /**
   * Exclui o Consumidor conforme Id.
   *
   * @async
   * @param {int} id
   * @returns {Promise}
   * @memberof CustomerService
   */
  async deleteById(id) {
    return this.dao.deleteById(id);
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