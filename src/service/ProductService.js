let superagent = require("superagent");

let Configuration = require("../util/Configuration");

/**
 * Service de Produto.
 *
 * @class ProductService
 */
class ProductService {

  /**
   * Retorna o Produto conforme Id.
   *
   * @async
   * @param {string} id
   * @returns {Promise<Product>}
   * @memberof ProductService
   */
  async getById(id) {
    superagent
      .get(Configuration.get("luizalabs.api") + "/product/" + id)
      .set("accept", "json")
      .then(response => {
        console.log(response);
      })
  }
}

module.exports = ProductService;