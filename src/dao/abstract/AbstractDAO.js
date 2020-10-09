const i18next = require("i18next");
const InternalError = require("../../error/InternalError");

/**
 * Abstract Data Access Object (DAO).
 *
 * @class AbstractDAO
 */
class AbstractDAO {

  /**
   * Cria uma instancia de AbstractDAO.
   *
   * @param {Class<? extends Model>} model
   * @param {{transaction: Transaction}} options
   * @memberof AbstractDAO
   */
  constructor(model, options) {
    if (this.constructor === AbstractDAO) {
      throw new InternalError(i18next.t("message:p_invalid_abstract_class_instantiation", {class: this.constructor.name}));
    }

    this.model = model;
    this.options = options;
  }

  /**
   * Cria o Model.
   *
   * @async
   * @param {{}<? extends Model>} data
   * @returns {Promise<{}<? extends Model>>}
   * @memberof AbstractDAO
   */
  async create(data) {
    return this.model.create(data, this.options);
  }

  /**
   * Modifica o Model.
   *
   * @async
   * @param {{}<? extends Model>} data
   * @returns {Promise<{}<? extends Model>>}
   * @memberof AbstractDAO
   */
  async update(data) {
    return this.model.update(data, Object.assign({where: {id: data.id}}, this.options));
  }

  /**
   * Exclui o Model.
   *
   * @async
   * @returns {Promise}
   * @memberof AbstractDAO
   */
  async delete(data) {
    return this.model.destroy(Object.assign({where: {id: data.id}}, this.options));
  }

  /**
   * Exclui o Model conforme Id.
   *
   * @async
   * @param {int} id
   * @returns {Promise}
   * @memberof AbstractDAO
   */
  async deleteById(id) {
    return this.model.destroy(Object.assign({where: {id}}, this.options));
  }

  /**
   * Exclui o Model conforme Opções.
   *
   * @async
   * @param {object} options
   * @returns {Promise}
   * @memberof AbstractDAO
   */
  async deleteBy(options) {
    return this.model.destroy(Object.assign(options, this.options));
  }

  /**
   * Retorna o Model.
   *
   * @async
   * @param {object} options
   * @returns {Promise<{}<? extends Model>>}
   * @memberof AbstractDAO
   */
  async get(options) {
    return this.model.findOne(Object.assign(options, this.options));
  } 

  /**
   * Retorna o Model conforme Id.
   *
   * @async
   * @param {int} id
   * @returns {Promise<{}<? extends Model>>}
   * @memberof AbstractDAO
   */
  async getById(id) {
    return this.model.findByPk(id, this.options);
  }

  /**
   * Retorna os Models.
   *
   * @async
   * @param {object} options
   * @returns {Promise<{}<? extends Model>[]>}
   * @memberof AbstractDAO
   */
  async getAll(options) {
    return this.model.findAll(Object.assign(options, this.options));
  }
}

module.exports = AbstractDAO;