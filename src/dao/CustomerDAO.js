const AbstractDAO = require("./abstract/AbstractDAO");
const Customer = require("../model/sequelize/Customer");

/**
 * Data Access Object (DAO) de Consumidor.
 *
 * @class CustomerDAO
 */
class CustomerDAO extends AbstractDAO {
  
  /**
   * Cria uma instancia de CustomerDAO.
   *
   * @param {{transation: Transaction}} options
   * @memberof CustomerDAO
   */
  constructor(options) {
    super(Customer, options);
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
    return super.get({where: {email}});
  } 
}

module.exports = CustomerDAO;