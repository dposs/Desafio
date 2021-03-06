const httpStatus = require("http-status");

const AbstractError = require("./common/AbstractError");
const ErrorEnum = require("../enum/ErrorEnum");

/**
 * Erro interno de parâmetros inválidos.
 * Normalmente utilizado para validar parâmetros de função.
 * 
 * @requires module:http-status
 * 
 * @class IllegalArgumentError
 * @extends {AbstractError}
 */
class IllegalArgumentError extends AbstractError {

  /**
   * Cria uma instancia de IllegalArgumentError.
   * 
   * @param {string} message 
   * @param {Object} [options]
   * @param {Object} [options.data]
   * @param {ErrorEnum} [options.type = ErrorEnum.ILLEGAL_ARGUMENT] 
   * @param {httpStatus.<NAME>} [options.status = httpStatus.INTERNAL_SERVER_ERROR] 
   * @memberof IllegalArgumentError
   */
  constructor(message, options) {
    let {data, type = ErrorEnum.ILLEGAL_ARGUMENT, status = httpStatus.INTERNAL_SERVER_ERROR} = options || {};
    super(message, data, type, status);
  }
}

module.exports = IllegalArgumentError;