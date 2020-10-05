const httpStatus = require("http-status");
const i18next = require("i18next");

const AuthService = require("../service/AuthService");
const InvalidPropertyError = require("../error/InvalidPropertyError");

/**
 * Controller de Autenticacao.
 * 
 * @class AuthController
 */
class AuthController {

  /**
   * Cria uma instancia de AuthController.
   * 
   * @memberof AuthController
   */
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Autentica o Usuário.
   * 
   * @async
   * @param {IncomingMessage} request 
   * @param {ServerResponse} response 
   * @returns {Promise}
   * @memberof AuthController
   */
  async login(request, response) {
    let customer = request.body;

    if (!customer.email) {
      throw new InvalidPropertyError().addProperty("email", i18next.t("message:mandatory"));
    }

    return this.authService.login(customer).then(jwt => {
      return response.status(httpStatus.OK).json(jwt);
    });
  }

  /**
   * Verifica se o Usuário esta autenticado.
   * 
   * @returns {boolean}
   * @memberof AuthController
   */
  isAuthenticated() {
    return this.authService.isUserAuthenticated();
  }
}

module.exports = AuthController;