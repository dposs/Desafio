const FavoriteProduct = require("../model/sequelize/FavoriteProduct");

/**
 * Data Access Object (DAO) de Produto Favorito.
 *
 * @class FavoriteProductDAO
 */
class FavoriteProductDAO {

  /**
   * Cria o Produto Favorito.
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
   * Exclui o Produto Favorito conforme Id.
   *
   * @async
   * @param {int} id
   * @returns {Promise<FavoriteProduct>}
   * @memberof FavoriteProductDAO
   */
  async deleteById(id) {
    return FavoriteProduct.destroy({where: {id}});
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

  /**
   * Retorna os Produtos Favoritos conforme Consumidor.
   *
   * @async
   * @param {int} customerId
   * @returns {Promise<FavoriteProduct[]>}
   * @memberof FavoriteProductDAO
   */
  async getByCustomer(customerId) {
    return FavoriteProduct.findAll({
      where: {
        customer_id: customerId
      }
    });
  }
}

module.exports = FavoriteProductDAO;