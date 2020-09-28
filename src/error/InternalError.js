let HttpStatus = require("http-status");

let AbstractError = require("./common/AbstractError");
let ErrorEnum = require("../enum/ErrorEnum");

/**
 * Erro interno do servidor.
 * Normalmente utilizado para erros inesperados.
 *
 * @requires module:http-status
 *
 * @class InternalError
 * @extends {AbstractError}
 */
class InternalError extends AbstractError {

  /**
   * Cria uma instancia de InternalError.
   *
   * @param {string} message
   * @param {Object} [options]
   * @param {Object} [options.data]
   * @param {ErrorEnum} [options.type = ErrorEnum.INTERNAL]
   * @param {HttpStatus.<code>} [options.status = HttpStatus.INTERNAL_SERVER_ERROR]
   * @memberof InternalError
   */
  constructor(message, options) {
    let {data, type = ErrorEnum.INTERNAL, status = HttpStatus.INTERNAL_SERVER_ERROR} = options || {};
    super(message, data, type, status);
  }
}

module.exports = InternalError;