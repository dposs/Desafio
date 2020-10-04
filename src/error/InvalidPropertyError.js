let httpStatus = require("http-status");
let i18next = require("i18next");

let AbstractError = require("./common/AbstractError");
let ErrorEnum = require("../enum/ErrorEnum");

/**
 * Erro de propriedade(s) do objeto inválida(s).
 * Normalmente utilizado para validação de JSON.
 * 
 * @requires module:http-status
 * @requires module:i18next
 * 
 * @class InvalidPropertyError
 * @extends {AbstractError}
 */
class InvalidPropertyError extends AbstractError {

  /**
   * Cria uma instancia de InvalidPropertyError.
   * 
   * @param {string} [message = i18next.t("message:invalid_properties")] 
   * @param {Object} [options]
   * @param {Object} [options.data]
   * @param {ErrorEnum} [options.type = ErrorEnum.INVALID_PROPERTY] 
   * @param {httpStatus.<NAME>} [options.status = httpStatus.BAD_REQUEST] 
   * @memberof InvalidPropertyError
   */
  constructor(message = i18next.t("message:invalid_properties"), options) {
    let {data, type = ErrorEnum.INVALID_PROPERTY, status = httpStatus.BAD_REQUEST} = options || {};
    super(message, data, type, status);
    Object.assign(this, {properties: []});
  }

  /**
   * Adiciona uma propriedade e sua respectiva mensagem de Erro.
   * 
   * @param {string} name 
   * @param {string} message 
   * @returns {InvalidPropertyError}
   * @memberof InvalidPropertyError
   */
  addProperty(name, message) {
    this.properties.push({name, message});
    return this;
  }

  /**
   * Adiciona propriedades.
   * 
   * @param {Object} properties 
   * @returns {InvalidPropertyError}
   * @memberof InvalidPropertyError
   */
  addProperties(properties) {
    this.properties.push(...properties);
    return this;
  }

  /**
   * Retorna se existem propriedades.
   * 
   * @returns {boolean} Verdadeiro se existem propriedades.
   * @memberof InvalidPropertyError
   */
  hasProperties() {
    return this.properties.length > 0;
  }

  /**
   * @inheritdoc
   * 
   * @override
   * @memberof InvalidPropertyError
   */
  get json() {
    let json = super.json;
    Object.assign(json.error, {properties: this.properties});
    return json;
  }
}

module.exports = InvalidPropertyError;