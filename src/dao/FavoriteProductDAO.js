const AbstractDAO = require("./abstract/AbstractDAO");
const FavoriteProduct = require("../model/sequelize/FavoriteProduct");

/**
 * Data Access Object (DAO) de Produto Favorito.
 *
 * @class FavoriteProductDAO
 */
class FavoriteProductDAO extends AbstractDAO {

  /**
   * Cria uma instancia de FavoriteProductDAO.
   *
   * @param {{transation: Transaction}} options
   * @memberof FavoriteProductDAO
   */
  constructor(options) {
    super(FavoriteProduct, options);
  }

  /**
   * Exclui os Produtos Favoritos conforme Consumidor.
   *
   * @async
   * @param {int} customerId
   * @returns {Promise}
   * @memberof FavoriteProductDAO
   */
  async deleteByCustomer(customerId) {
    return super.deleteBy({where: {customer_id: customerId}});
  }

  /**
   * Retorna o Produto Favorito conforme Identificadores Únicos.
   *
   * Identificadores: 
   * - Id do Consumidor
   * - Id do Produto
   *
   * @async
   * @param {int} customerId
   * @param {string} productId
   * @returns {Promise<FavoriteProduct>}
   * @memberof FavoriteProductDAO
   */
  async getUnique(customerId, productId) {
    return super.get({
      where: {
        customer_id: customerId,
        product_id: productId
      }
    });
  }

  /**
   * Retorna os Produtos Favoritos conforme Consumidor.
   *
   * @async
   * @param {int} customerId
   * @returns {Promise<FavoriteProduct[]>}
   * @memberof FavoriteProductDAO
   */
  async getByCustomer(customerId) {
    return super.getAll({
      where: {
        customer_id: customerId
      }
    });
  }
}

module.exports = FavoriteProductDAO;