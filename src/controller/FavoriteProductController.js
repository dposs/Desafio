let httpStatus = require("http-status");

let FavoriteProductService = require("../service/FavoriteProductService");

/**
 * Controller de Produto Favorito.
 *
 * @class FavoriteProductController
 */
class FavoriteProductController {

  /**
   * Cria uma instancia de FavoriteProductController.
   *
   * @memberof FavoriteProductController
   */
  constructor() {
    this.service = new FavoriteProductService();
  }

  /**
   * Cria o Produto Favorito.
   * 
   * @async
   * @param {IncomingMessage} request 
   * @param {ServerResponse} response 
   * @returns {Promise}
   * @memberof CustomerController
   */
  async create(request, response) {
    let customerId = request.user.id;
    let productId = request.params.id;

    let favoriteProduct = {"customer_id": customerId, "product_id": productId};

    return this.service.create(favoriteProduct)
      .then(favoriteProduct => response.status(httpStatus.OK).json(favoriteProduct));
  }
}

module.exports = FavoriteProductController;