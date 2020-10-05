const httpStatus = require("http-status");
const ProductService = require("../service/ProductService");

/**
 * Controller de Produto.
 *
 * @class ProductController
 */
class ProductController {

  /**
   * Cria uma instancia de ProductController.
   *
   * @memberof ProductController
   */
  constructor() {
    this.service = new ProductService();
  }

  /**
   * Adiciona o Produto aos Favoritos.
   * 
   * @async
   * @param {IncomingMessage} request 
   * @param {ServerResponse} response 
   * @returns {Promise}
   * @memberof CustomerController
   */
  async addFavorite(request, response) {
    let customerId = request.user.id;
    let productId = request.params.id;

    return this.service.addFavorite(customerId, productId)
      .then(() => response.status(httpStatus.OK).json());
  }

  /**
   * Remove o Produto dos Favoritos.
   * 
   * @async
   * @param {IncomingMessage} request 
   * @param {ServerResponse} response 
   * @returns {Promise}
   * @memberof CustomerController
   */
  async removeFavorite(request, response) {
    let customerId = request.user.id;
    let productId = request.params.id;

    return this.service.removeFavorite(customerId, productId)
      .then(() => response.status(httpStatus.OK).json());
  }

  /**
   * Retorna os Produtos Favoritos.
   * 
   * @async
   * @param {IncomingMessage} request 
   * @param {ServerResponse} response 
   * @returns {Promise}
   * @memberof CustomerController
   */
  async getFavorites(request, response) {
    let customerId = request.user.id;

    return this.service.getFavorites(customerId)
      .then(products => response.status(httpStatus.OK).json(products));
  }
}

module.exports = ProductController;