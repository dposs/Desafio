let HttpStatus = require("http-status");

let AbstractError = require("./common/AbstractError");
let ErrorEnum = require("../enum/ErrorEnum");

/**
 * Erro de validação.
 * 
 * @requires module:http-status
 * 
 * @class InvalidError
 * @extends {AbstractError}
 */
class InvalidError extends AbstractError {
  
  /**
   * Cria uma instancia de InvalidError.
   * 
   * @param {string} message 
   * @param {Object} [options]
   * @param {Object} [options.data]
   * @param {ErrorEnum} [options.type = ErrorEnum.INVALID] 
   * @param {HttpStatus.<NAME>} [options.status = HttpStatus.BAD_REQUEST] 
   * @memberof InvalidError
   */
  constructor(message, options) {
    let {data, type = ErrorEnum.INVALID, status = HttpStatus.BAD_REQUEST} = options || {};
    super(message, data, type, status);
  }
}

module.exports = InvalidError;