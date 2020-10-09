const i18next = require("i18next");

const CustomerDAO = require("../dao/CustomerDAO");
const DataSource = require("../util/DataSource");
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
   * @param {{transaction: Transaction}} [options]
   * @memberof CustomerService
   */
  constructor(options) {
    this.dao = new CustomerDAO(options);
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
    if (exists) error.addProperty("email", i18next.t("validation:entity.customer.exists"));

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
    return this.dao.update(customer).then(() => {
      return this.getById(customer.id);
    });
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
    let FavoriteProductService = require("./FavoriteProductService");

    return DataSource.startTransaction(t => {
      let customerDAO = new CustomerDAO({transaction: t});
      let favoriteProductService = new FavoriteProductService({transaction: t});

      return favoriteProductService.deleteByCustomer(id).then(() => {
        return customerDAO.deleteById(id);
      });
    });
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