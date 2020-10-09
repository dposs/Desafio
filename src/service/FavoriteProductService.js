const i18next = require("i18next");

const FavoriteProductDAO = require("../dao/FavoriteProductDAO");
const FavoriteProduct = require("../model/sequelize/FavoriteProduct");

const InvalidError = require("../error/InvalidError");

/**
 * Service de Produto Favorito.
 *
 * @class FavoriteProductService
 */
class FavoriteProductService {

  /**
   * Cria uma instancia de FavoriteProductService.
   *
   * @param {{transaction: Transaction}} [options]
   * @memberof FavoriteProductService
   */
  constructor(options) {
    this.dao = new FavoriteProductDAO(options);
  }

  /**
   * Cria o Produto Favorito.
   *
   * @async
   * @param {FavoriteProduct} favoriteProduct
   * @returns {Promise<FavoriteProduct>}
   * @memberof FavoriteProductService
   */
  async create(favoriteProduct) {
    let ProductService = require("./ProductService");

    let {"customer_id": customerId, "product_id": productId} = favoriteProduct;

    let exists = await this.getUnique(customerId, productId);
    if (exists) throw new InvalidError(i18next.t("validation:entity.favorite_product.exists"));

    let product = await new ProductService().getById(productId);
    if (!product) throw new InvalidError(i18next.t("validation:entity.product.nonexistent"));

    return this.dao.create(favoriteProduct);
  }

  /**
   * Exclui o Produto Favorito.
   * 
   * @async
   * @param {FavoriteProduct} favoriteProduct
   * @returns {Promise}
   * @memberof FavoriteProductService
   */
  async delete(favoriteProduct) {
    let {"customer_id": customerId, "product_id": productId} = favoriteProduct;

    favoriteProduct = await this.getUnique(customerId, productId);
    if (!favoriteProduct) throw new InvalidError(i18next.t("validation:entity.favorite_product.nonexistent"));

    return this.deleteById(favoriteProduct.id);
  }

  /**
   * Exclui o Produto Favorito conforme Id.
   *
   * @async
   * @param {int} id
   * @returns {Promise}
   * @memberof FavoriteProductService
   */
  async deleteById(id) {
    return this.dao.deleteById(id);
  }

  /**
   * Exclui os Produtos Favoritos conforme Consumidor.
   *
   * @async
   * @param {int} customerId
   * @returns {Promise}
   * @memberof FavoriteProductService
   */
  async deleteByCustomer(customerId) {
    return this.dao.deleteByCustomer(customerId);
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

  /**
   * Retorna os Produtos Favoritos conforme Consumidor.
   *
   * @async
   * @param {int} customerId
   * @returns {Promise<FavoriteProduct[]>}
   * @memberof FavoriteProductService
   */
  async getByCustomer(customerId) {
    return this.dao.getByCustomer(customerId);
  }
}

module.exports = FavoriteProductService;