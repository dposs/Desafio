let HttpStatus = require("http-status");

let CustomerService = require("../service/CustomerService");

/**
 * Controller de Consumidor.
 *
 * @class CustomerController
 */
class CustomerController {

  /**
   * Cria uma instancia de CustomerController.
   *
   * @memberof CustomerController
   */
  constructor() {
    this.service = new CustomerService();
  }

  /**
   * Cria o Consumidor.
   * 
   * @async
   * @param {IncomingMessage} request 
   * @param {ServerResponse} response 
   * @returns {Promise}
   * @memberof CustomerController
   */
  async create(request, response) {
    let customer = request.body;

    return this.service.create(customer)
      .then(customer => response.status(HttpStatus.OK).json(customer));
  }
}

module.exports = CustomerController;