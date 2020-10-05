const _ = require("lodash");
const config = require("config");

const InternalError = require("../error/InternalError");

/**
 * Configurações por ambiente.
 * 
 * @requires module:config
 * @class Configuration
 */
class Configuration {

  /**
   * Cria uma instancia de Configuration.
   * 
   * @param {Object} data 
   * @memberof Configuration
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * Carrega uma Configuração conforme diretório.
   * Utiliza cache de Configurações para performance.
   * 
   * @static
   * @param {string} path Endereço do diretório de configuração.
   * @param {Object} [options] Opções
   * @param {string} [options.name] Nome da Configuração.
   * @param {boolean} [options.default] Verdadeiro se a Configuração é a padrão.
   * @returns {Configuration}
   * @memberof Configuration
   */
  static load(path, options) {
    let configuration = Configuration.paths[path];

    if (!configuration) {
      configuration = new Configuration(config.util.loadFileConfigs(path));
      Configuration.paths[path] = configuration;
    }

    if (options && options.name) {
      Configuration.names[options.name] = configuration;
    }

    if (options && options.default) {
      Configuration.default = configuration;
    }

    return configuration;
  }

  /**
   * Retorna o conteúdo de uma propriedade.
   * Caso não informado o nome da Configuração, utiliza a Configuração padrão.
   * 
   * @static
   * @param {...string} params Nome da Configuração e nome da Propriedade, ou somente nome da Propriedade.
   * @returns {*}
   * @throws {InternalError} A Configuração deve ter sido inicializada.
   * @memberof Configuration
   */
  static get(...params) {
    if (params.length == 1) params.unshift(undefined);

    let [name, property] = params;
    let configuration = name ? Configuration.names[name] : Configuration.default;

    if (!configuration) {
      throw new InternalError("Configuração não inicializada. Não foi possível obter a propriedade '" + property + "'.");
    }

    return configuration.get(property);
  }

  /**
   * Retorna o conteúdo de uma propriedade.
   * 
   * @param {string} property Nome da propriedade.
   * @returns {*}
   * @memberof Configuration
   */
  get(property) {
    return _.get(this.data, property);
  }
}

Configuration.names = {};
Configuration.paths = {};

module.exports = Configuration;