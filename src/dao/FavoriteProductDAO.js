let FavoriteProduct = require("../model/sequelize/FavoriteProduct");

/**
 * Data Access Object (DAO) de Produto Favorito.
 *
 * @class FavoriteProductDAO
 */
class FavoriteProductDAO {

  /**
   * Cria um Produto Favorito.
   *
   * @async
   * @param {FavoriteProduct} favoriteProduct
   * @returns {Promise<FavoriteProduct>}
   * @memberof FavoriteProductDAO
   */
  async create(favoriteProduct) {
    return FavoriteProduct.create(favoriteProduct);
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
    return FavoriteProduct.findOne({
      where: {
        customer_id: customerId,
        product_id: productId
      }
    });
  }
}

module.exports = FavoriteProductDAO;