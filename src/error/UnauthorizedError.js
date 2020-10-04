let httpStatus = require("http-status");
let AbstractError = require("./common/AbstractError");
let ErrorEnum = require("../enum/ErrorEnum");

/**
 * Erro de Autenticacao e/ou Autorizacao.
 * 
 * @requires module:http-status
 * 
 * @class UnauthorizedError
 * @extends {AbstractError}
 */
class UnauthorizedError extends AbstractError {

  /**
   * Cria uma instancia de UnauthorizedError.
   * 
   * @param {string} message 
   * @param {Object} [options]
   * @param {Object} [options.data]
   * @param {ErrorEnum} [options.type = ErrorEnum.UNAUTHORIZED] 
   * @param {httpStatus.<NAME>} [options.status = httpStatus.UNAUTHORIZED] 
   * @memberof UnauthorizedError
   */
  constructor(message, options) {
    let {data, type = ErrorEnum.UNAUTHORIZED, status = httpStatus.UNAUTHORIZED} = options || {};
    super(message, data, type, status);
  }
}

module.exports = UnauthorizedError;