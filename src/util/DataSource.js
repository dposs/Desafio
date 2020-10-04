let DataSourceORMEnum = require("../enum/DataSourceORMEnum");
let IllegalArgumentError = require("../error/IllegalArgumentError");
let InternalError = require("../error/InternalError");

/**
 * Biblioteca de DataSources.
 *
 * @class DataSource
 */
class DataSource {

  /**
   * Inicializa uma instancia de DataSource.
   *
   * @static
   * @param {string} name Nome do DataSource
   * @param {DataSourceORMEnum} orm Framework ORM do DataSource
   * @param {Object} [options] Opções
   * @param {Object} [options.isDefault = false] DataSource default
   * @returns {DataSource}
   * @memberof DataSource
   */
  static initialize(name, orm, options) {
    let {isDefault = false} = options || {};

    let instance = Object.assign(new DataSource(), {name, orm, schemas: {}, models: {}});

    if (!DataSource.instances) {
      DataSource.instances = {};
    }

    if (isDefault) {
      DataSource.default = instance;
    }

    DataSource.instances[name] = instance;
    DataSource.last = instance;

    return instance;
  }

  /**
   * Conecta em um DataSource.
   *
   * @async
   * @param {Object} options JSON contendo os parâmetros de conexão.
   * @returns {Promise}
   * @memberof DataSource
   */
  async connect(options) {
    switch(this.orm) {
      case DataSourceORMEnum.SEQUELIZE:
        let Sequelize = require("sequelize");

        DataSource.IsolationLevel = {
          READ_UNCOMMITTED: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
          READ_COMMITTED: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
          REPEATABLE_READ: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
          SERIALIZABLE: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        };

        DataSource.Lock = {
          UPDATE: Sequelize.Transaction.LOCK.UPDATE,
          SHARE: Sequelize.Transaction.LOCK.SHARE
        };

        this.sequelize = new Sequelize(options);
        this.connection = this.sequelize.authenticate({logging: false});
        
        break;

      default:
        throw new IllegalArgumentError("Este Framework ORM não é suportado.");
    }

    return this.connection;
  }

  /**
   * Retorna uma instancia de DataSource conforme nome.
   * Se nome for omitido, retorna a última instancia inicializada.
   *
   * @static
   * @param {string} [name] Nome do DataSource
   * @returns {DataSource} Instancia de DataSource
   * @throws {Error} O DataSource deve ter sido inicializado
   * @memberof DataSource
   */
  static get(name) {
    if (!name && DataSource.last) {
      name = DataSource.last.name;
    }

    if (DataSource.instances && DataSource.instances[name]) {
      return DataSource.instances[name];
    }

    throw new IllegalArgumentError("DataSource '" + name + "' nao inicializado. Inicialize com 'DataSource.initialize()'.");
  }

  /**
   * Versão estática da função 'startTransaction'.
   * Utiliza como instancia o DataSource default.
   *
   * @async
   * @static
   * @param {Object} [options]
   * @param {Function} [callback]
   * @returns {Promise}
   * @memberof DataSource
   */
  static async startTransaction(options, callback) {
    if (!DataSource.default) {
      throw new InternalError("DataSource default não definido.");
    }

    return DataSource.default.startTransaction(options, callback);
  }

  /**
   * Versão estática da função 'useTransaction'.
   * Utiliza como instancia o DataSource default.
   *
   * @async
   * @static
   * @param {Object} transaction
   * @param {Object} [options]
   * @param {Function} [callback]
   * @returns {Promise}
   * @memberof DataSource
   */
  static async useTransaction(transaction, options, callback) {
    if (!DataSource.default) {
      throw new InternalError("DataSource default não definido.");
    }

    return DataSource.default.useTransaction(transaction, options, callback);
  }

  /**
   * Inicia e executa uma transação.
   *
   * @async
   * @param {Object} [options]
   * @param {Function} [callback]
   * @returns {Promise}
   * @memberof DataSource
   */
  async startTransaction(options, callback) {
    let params = [];

    if (options) params.push(options);
    if (callback) params.push(callback);

    switch(this.orm) {
      case DataSourceORMEnum.SEQUELIZE:
        return this.sequelize.transaction(...params);

      default:
        throw new IllegalArgumentError("Este Framework ORM não suporta controle de transações.");
    }
  }

  /**
   * Executa uma transação.
   *
   * @async
   * @param {Object} [transaction]
   * @param {Object} [options]
   * @param {Function} [callback]
   * @returns {Promise}
   * @memberof DataSource
   */
  async useTransaction(transaction, options, callback) {
    if (!callback) {
      callback = options;
      options = {};
    }

    switch(this.orm) {
      case DataSourceORMEnum.SEQUELIZE:
        return transaction ? callback(transaction) : this.startTransaction(options, callback);

      default:
        throw new IllegalArgumentError("Este Framework ORM não suporta controle de transações.");
    }
  }

  /**
   * Inicializa e retorna um Model.
   *
   * @param {<? extends Model>} model
   * @returns {Object}
   * @memberof DataSource
   */
  initializeModel(model) {
    switch(this.orm) {
      case DataSourceORMEnum.SEQUELIZE:
        return model.initialize(this.sequelize);

      default:
        throw new IllegalArgumentError("Este Framework ORM não é suportado.");
    }
  }

  /**
   * Armazena um Model.
   *
   * @param {Model} model
   * @param {Object} [options.initializeModel = true]
   * @memberof DataSource
   */
  addModel(model, options) {
    let {initializeModel = true} = options || {};

    if (initializeModel) {
      model = this.initializeModel(model);
    }

    this.models[model.name] = model;
  }

  /**
   * Versão estática da função 'getModel'.
   * Utiliza como instancia o DataSource default.
   *
   * @static
   * @param {string} name
   * @returns {Model}
   * @memberof DataSource
   */
  static getModel(name) {
    if (!DataSource.default) {
      throw new InternalError("DataSource default não definido.");
    }
    return DataSource.default.getModel(name);
  }

  /**
   * Retorna um Model.
   *
   * @param {string|Object} name
   * @returns {Model}
   * @memberof DataSource
   */
  getModel(name) {
    if (typeof name != "string") {
      return name;
    }

    if (this.models[name]) {
      return this.models[name];
    }

    let schema = this.getSchema(name);

    if (!schema) {
      throw new IllegalArgumentError("Schema '" + name + "' não definido. Utilize 'addSchema(schema)'.");
    }

    let model = this.initializeModel(schema);
    this.addModel(schema.name, model);

    return model;
  }

  /**
   * Armazena um Schema.
   *
   * @param {Object} schema
   * @param {Object} [options]
   * @param {Object} [options.initializeModel = false]
   * @memberof DataSource
   */
  addSchema(schema, options) {
    let {initializeModel = false} = options || {};

    this.schemas[schema.name] = schema;

    if (initializeModel) {
      let model = this.initializeModel(schema);
      this.addModel(schema.name, model);
    }
  }

  /**
   * Retorna um Schema.
   *
   * @param {string} name
   * @returns {Object}
   * @memberof DataSource
   */
  getSchema(name) {
    return this.schemas[name];
  }
}

module.exports = DataSource;
