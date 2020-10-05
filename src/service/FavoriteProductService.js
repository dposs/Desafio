let FavoriteProductDAO = require("../dao/FavoriteProductDAO");

let InvalidError = require("../error/InvalidError");

/**
 * Service de Produto Favorito.
 *
 * @class FavoriteProductService
 */
class FavoriteProductService {

  /**
   * Cria uma instancia de FavoriteProductService.
   *
   * @memberof FavoriteProductService
   */
  constructor() {
    this.dao = new FavoriteProductDAO();
  }

  /**
   * Cria um Produto Favorito.
   *
   * @async
   * @param {FavoriteProduct} favoriteProduct
   * @returns {Promise<FavoriteProduct>}
   * @memberof FavoriteProductService
   */
  async create(favoriteProduct) {
    let {"customer_id": customerId, "product_id": productId} = favoriteProduct;

    let exists = await this.getUnique(customerId, productId);
    if (exists) throw new InvalidError("Produto já adicionado aos Favoritos."); // @todo daniel i18n

    return this.dao.create(favoriteProduct);
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
   * @memberof FavoriteProductService
   */
  async getUnique(customerId, productId) {
    return this.dao.getUnique(customerId, productId);
  }
}

module.exports = FavoriteProductService;