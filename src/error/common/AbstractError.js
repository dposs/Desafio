const _ = require("lodash");
const i18next = require("i18next");

/**
 * Abstract Class de Erro.
 *
 * @requires module:i18next
 * @class AbstractError
 * @extends {Error}
 */
class AbstractError extends Error {

  /**
   * Cria uma instancia de AbstractError.
   *
   * @param {string} message
   * @param {Object} data
   * @param {ErrorEnum} type
   * @param {httpStatus.<code>} status
   * @throws {Error} Classes abstratas não podem ser instanciadas.
   * @throws {Error} Parâmetro 'data' deve ser um JSON.
   * @memberof AbstractError
   */
  constructor(message, data, type, status) {
    super(message);

    if (data != undefined && !_.isObjectLike(data)) {
      throw new Error("Parâmetro 'data' deve ser um JSON.");
    }

    Object.assign(this, {data, type, status});

    if (this.constructor === AbstractError) {
      throw new Error(i18next.t("message:p_invalid_abstract_class_instantiation", {class: "AbstractError"}));
    }
  }

  /**
   * Configura e retorna a instancia de AbstractError conforme Erro de Origem.
   *
   * @param {Error} error
   * @returns {Object<? extends AbstractError>}
   * @memberof AbstractError
   */
  from(error) {
    this.message = this.message ? this.message.concat(" ").concat(error.message) : error.message;
    this.stack = error.stack;
    return this;
  }

  /**
   * Retorna o JSON do Erro.
   *
   * @readonly
   * @memberof AbstractError
   */
  get json() {
    let json = {
      error: {
        code: this.type.code,
        type: this.type.type
      }
    };

    if (this.message) {
      Object.assign(json.error, {message: this.message});
    }

    if (this.data) {
      Object.assign(json.error, {data: this.data});
    }

    return json;
  }
}

module.exports = AbstractError;