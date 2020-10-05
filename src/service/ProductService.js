const httpStatus = require("http-status");
const superagent = require("superagent");

const FavoriteProduct = require("../model/sequelize/FavoriteProduct");
const Configuration = require("../util/Configuration");

/**
 * Service de Produto.
 *
 * @class ProductService
 */
class ProductService {

  /**
   * Adiciona o Produto aos Favoritos.
   *
   * @async
   * @param {int} customerId
   * @param {string} productId
   * @returns {Promise}
   * @memberof ProductService
   */
  async addFavorite(customerId, productId) {
    let FavoriteProductService = require("./FavoriteProductService");
    let favoriteProduct = new FavoriteProduct({"customer_id": customerId, "product_id": productId}).get({plain: true});

    return new FavoriteProductService().create(favoriteProduct);
  }

  /**
   * Remove o Produto dos Favoritos.
   *
   * @async
   * @param {int} customerId
   * @param {string} productId
   * @returns {Promise}
   * @memberof ProductService
   */
  async removeFavorite(customerId, productId) {
    let FavoriteProductService = require("./FavoriteProductService");
    let favoriteProduct = new FavoriteProduct({"customer_id": customerId, "product_id": productId}).get({plain: true});

    return new FavoriteProductService().delete(favoriteProduct);
  }

  /**
   * Retorna os Produtos Favoritos do Consumidor.
   *
   * @async
   * @param {int} customerId
   * @returns {Promise<Product[]>}
   * @memberof ProductService
   */
  async getFavorites(customerId) {
    let FavoriteProductService = require("./FavoriteProductService");
    let favorites = await new FavoriteProductService().getByCustomer(customerId);

    return Promise.all(favorites.map(favorite => {
      return this.getById(favorite.product_id);
    }));
  }

  /**
   * Retorna o Produto conforme Id.
   *
   * @async
   * @param {string} id
   * @returns {Promise<Product>}
   * @memberof ProductService
   */
  async getById(id) {
    return superagent
      .get(Configuration.get("luizalabs.api") + "/product/" + id + "/")
      .set("accept", "json")
      .then(response => response.body)
      .catch(error => {
        if (error.status == httpStatus.NOT_FOUND) return null;
        throw error;
      });
  }
}

module.exports = ProductService;