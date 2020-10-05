let httpStatus = require("http-status");

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
      .then(customer => response.status(httpStatus.OK).json(customer));
  }

  /**
   * Modifica o Consumidor.
   * 
   * @async
   * @param {IncomingMessage} request 
   * @param {ServerResponse} response 
   * @returns {Promise}
   * @memberof CustomerController
   */
  async update(request, response) {
    let id = request.user.id;
    let customer = request.body;

    Object.assign(customer, {id});

    return this.service.update(customer)
      .then(customer => response.status(httpStatus.OK).json(customer));
  }

  /**
   * Exclui o Consumidor.
   * 
   * @async
   * @param {IncomingMessage} request 
   * @param {ServerResponse} response 
   * @returns {Promise}
   * @memberof CustomerController
   */
  async delete(request, response) {
    let id = request.user.id;

    return this.service.deleteById(id)
      .then(() => response.status(httpStatus.OK).json());
  }

  /**
   * Retorna o Consumidor.
   * 
   * @async
   * @param {IncomingMessage} request 
   * @param {ServerResponse} response 
   * @returns {Promise}
   * @memberof CustomerController
   */
  async get(request, response) {
    let id = request.user.id;

    return this.service.getById(id)
      .then(customer => response.status(httpStatus.OK).json(customer));
  }
}

module.exports = CustomerController;