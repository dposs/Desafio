const jwt = require("jsonwebtoken");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const CustomerService = require("./CustomerService");

const Configuration = require("../util/Configuration");
const UnauthorizedError = require("../error/UnauthorizedError");

/**
 * Service de Autenticação.
 *
 * @class AuthService
 */
class AuthService {

  /**
   * Cria uma nova instancia de AuthService.
   *
   * @memberof AuthService
   */
  constructor() {
    this.customerService = new CustomerService();
    this.security = Configuration.get("security");
  }

  /**
   * Inicializa os Métodos de Autenticação.
   *
   * @memberof AuthService
   */
  initialize() {
    passport.use(new JwtStrategy({
      "jwtFromRequest": ExtractJwt.fromAuthHeaderAsBearerToken(),
      "secretOrKey": this.security.secret
    }, (payload, done) => {
      return this.customerService.getById(payload.sub.id)
        .then(customer => customer ? done(null, customer) : done(new UnauthorizedError()))
        .catch(error => done(error));
    }));
  }

  /**
   * Autentica o Usuário.
   *
   * @async
   * @param {Customer} customer
   * @returns {Promise<{jwt: string}>}
   * @throws UnauthorizedError
   * @memberof AuthService
   */
  async login(customer) {
    customer = await this.customerService.getByEmail(customer.email);
    if (!customer) throw new UnauthorizedError();

    return {jwt: jwt.sign({"sub": customer}, this.security.secret)};
  }

  /**
   * Verifica se o Usuário esta autenticado.
   * 
   * @returns {boolean}
   * @memberof AuthService
   */
  isUserAuthenticated() {
    return passport.authenticate("jwt", {session: false});
  }
}

module.exports = AuthService;