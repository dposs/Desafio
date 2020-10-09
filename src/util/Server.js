const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const i18next = require("i18next");
const i18nextFSBackend = require("i18next-node-fs-backend");

const Configuration = require("./Configuration");
const DataSource = require("../util/DataSource");
const DataSourceORMEnum = require("../enum/DataSourceORMEnum");
const Loader = require("./Loader");

const RequestNotFoundError = require("../error/RequestNotFoundError");

/**
 * Biblioteca de Gerenciamento do Servidor.
 *
 * @class Server
 */
class Server {

  /**
   * Cria uma instancia do Servidor informado.
   *
   * @static
   * @param {string} name
   * @returns {Server}
   * @memberof Server
   */
  static async create(name) {
    let Server = this;
    let server = Object.assign(new Server(), {name});

    await server.initializeConfigurations();

    server.express = express();

    Server.DEFAULT_ENVIRONMENT = process.env.NODE_ENV;
    Server.DEFAULT_SOURCE = "src";

    return server;
  }

  /**
   * Inicia o Servidor.
   *
   * @returns {Server}
   * @memberof Server
   */
  async start() {
    await this.onServerStart();

    return new Promise(resolve => {
      this.express.listen(this.port, () => {
        this.showStartupInfo();
        return resolve(this);
      });
    });
  }

  /**
   * Retorna a porta do Servidor.
   *
   * @abstract
   * @readonly
   * @returns {int}
   * @memberof Server
   */
  get port() {
    return Configuration.get("server.port");
  }

  /**
   * Retorna o ambiente do Servidor.
   *
   * @readonly
   * @returns {string}
   * @memberof Server
   */
  get environment() {
    return Server.DEFAULT_ENVIRONMENT;
  }

  /**
   * Retorna o diretorio de Sources do Servidor.
   *
   * @readonly
   * @returns {string}
   * @memberof Server
   */
  get source() {
    return Server.DEFAULT_SOURCE;
  }

  /**
   * Evento disparado no momento de inicializacao do Servidor.
   *
   * @returns {Server}
   * @memberof Server
   */
  async onServerStart() {
    await this.initializeInternationalization();
    await this.initializeDataSources();
    await this.initializeBasicAuthentication();
    await this.initializeModels();
    await this.initializeMiddlewares();
    await this.initializeRoutes();

    return this;
  }

  /**
   * Inicializa as Configuracoes.
   *
   * @memberof Server
   */
  async initializeConfigurations() {
    Configuration.load("./config", {name: "main", default: true});
  }

  /**
   * Inicializa a Internacionalização.
   *
   * @memberof Server
   */
  async initializeInternationalization() {
    i18next
      .use(i18nextFSBackend)
      .init({
        lng: Configuration.get("localization.language"),
        ns: ["message", "validation"],
        defaultNS: "message",
        load: "currentOnly",
        backend: {
          loadPath: "./locale/{{lng}}/{{ns}}.json",
        }
      });
  }

  /**
   * Inicializa os DataSources.
   *
   * @memberof Server
   */
  async initializeDataSources() {
    this.datasource = DataSource;

    await this.datasource
      .initialize("MySQL", DataSourceORMEnum.SEQUELIZE, {isDefault: true})
      .connect(Configuration.get("database.mysql.challenge"))
      .catch(error => console.error(error));
  }

  /**
   * Inicializa os metodos de Autenticacao de Endpoint.
   *
   * @memberof Server
   */
  async initializeBasicAuthentication() {
    let AuthService = require("../service/AuthService");
    new AuthService().initialize();
  }

  /**
   * Inicializa os Models.
   *
   * @memberof Server
   */
  async initializeModels() {
    let mySQL = this.datasource.get("MySQL");

    Loader
      .initialize(this.source)
      .load("model/sequelize")
      .exec(model => {
        model.initialize(mySQL.sequelize);
        mySQL.addModel(model);
      })
      .exec(model => {
        model.associate(mySQL.models)
      });

    // Object.values(mySQL.models).forEach(model => model.associate(mySQL.models));
  }

  /**
   * Inicializa os Middlewares do Express.
   *
   * @memberof Server
   */
  async initializeMiddlewares() {
    this.express.use(passport.initialize());
    this.express.use(bodyParser.json());
    this.express.use(cors({origin: "*", allowedHeaders: ["Authorization", "Origin", "X-Requested-With", "Content-Type", "Accept"]}));
  }

  /**
   * Inicializa as Rotas.
   *
   * @memberof Server
   */
  async initializeRoutes() {
    let AuthController = require("../controller/AuthController");
    let CustomerController = require("../controller/CustomerController");
    let ErrorController = require("../controller/ErrorController");
    let ProductController = require("../controller/ProductController");

    let authController = new AuthController();
    let customerController = new CustomerController();
    let errorController = new ErrorController();
    let productController = new ProductController();

    // Routes

    let router = express.Router();

    router.route("/login")
      .post((request, response, next) => authController.login(request, response).catch(next));

    router.route("/customer")
      .post((request, response, next) => customerController.create(request, response).catch(next))
      .get(authController.isAuthenticated(), (request, response, next) => customerController.get(request, response).catch(next))
      .put(authController.isAuthenticated(), (request, response, next) => customerController.update(request, response).catch(next))
      .delete(authController.isAuthenticated(), (request, response, next) => customerController.delete(request, response).catch(next));
    
    router.route("/product/:id/favorite")
      .post(authController.isAuthenticated(), (request, response, next) => productController.addFavorite(request, response).catch(next))
      .delete(authController.isAuthenticated(), (request, response, next) => productController.removeFavorite(request, response).catch(next));

    router.route("/product/favorite")
      .get(authController.isAuthenticated(), (request, response, next) => productController.getFavorites(request, response).catch(next))

    // Set Router

    this.express.use("/challenge", router);

    // 404 Error

    this.express.all("*", (request, response, next) => {
      next(new RequestNotFoundError("Recurso inexistente: " + request.originalUrl));
    });

    // Global Error Handler

    this.express.use(errorController.handler());
  }

  /**
   * Exibe informacao de inicializacao do Servidor.
   *
   * @memberof Server
   */
  showStartupInfo() {
    console.log("");
    console.log("  " + this.name + ": ONLINE");
    console.log("  ENVIRONMENT: " + (this.environment || "-"));
    console.log("  PORT: " + this.port.toString());
    console.log("");
  }
}

module.exports = Server;