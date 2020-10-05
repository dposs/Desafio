const httpStatus = require("http-status");

const AbstractError = require("./common/AbstractError");
const ErrorEnum = require("../enum/ErrorEnum");

/**
 * Erro de requisição para recurso inexistente.
 * Normalmente utilizado para validação de requisições http.
 * 
 * @requires module:http-status
 * 
 * @class RequestNotFoundError
 * @extends {AbstractError}
 */
class RequestNotFoundError extends AbstractError {

  /**
   * Cria uma instancia de RequestNotFoundError.
   * 
   * @param {string} message 
   * @param {Object} [options]
   * @param {Object} [options.data]
   * @param {ErrorEnum} [options.type = ErrorEnum.REQUEST_NOT_FOUND] 
   * @param {httpStatus.<NAME>} [options.status = httpStatus.NOT_FOUND] 
   * @memberof RequestNotFoundError
   */
  constructor(message, options) {
    let {data, type = ErrorEnum.REQUEST_NOT_FOUND, status = httpStatus.NOT_FOUND} = options || {};
    super(message, data, type, status);
  }
}

module.exports = RequestNotFoundError;