let passport = require("passport");
let bodyParser = require("body-parser");
let cors = require("cors");
let express = require("express");
let i18next = require("i18next");
let i18nextFSBackend = require("i18next-node-fs-backend");

let Configuration = require("./Configuration");
let DataSource = require("../util/DataSource");
let DataSourceORMEnum = require("../enum/DataSourceORMEnum");
let Loader = require("./Loader");

let RequestNotFoundError = require("../error/RequestNotFoundError");

/**
 * Biblioteca de Gerenciamento do Servidor.
 *
 * @requires module:express
 * @requires module:i18next
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

    server.onServerCreate();

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
   * Evento disparado no momento de criacao do Servidor.
   *
   * @returns {Server}
   * @memberof Server
   */
  onServerCreate() {
    return this;
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
   * Inicializa os Models.
   *
   * @memberof Server
   */
  async initializeModels() {
    let mySQL = this.datasource.get("MySQL");

    Loader
      .initialize(this.source)
      .load("model/sequelize")
      .exec(Model => mySQL.addModel(Model));

    Object.values(mySQL.models).forEach(model => {
      model.associate(mySQL.models);
    });
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

    let authController = new AuthController();
    let customerController = new CustomerController();
    let errorController = new ErrorController();

    // Routes

    let router = express.Router();

    router.route("/login")
      .post((request, response, next) => authController.login(request, response).catch(next));

    router.route("/customer")
      .post((request, response, next) => customerController.create(request, response).catch(next));
      

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
    let size = this.name.length + 20;

    console.log(" -----" + "".padEnd(size, "-"));
    console.log("|     " + "".padEnd(size, " ") + "|");
    console.log("|     " + (this.name + " ONLINE").padEnd(size, " ") + "|");
    console.log("|     ENVIRONMENT: " + this.environment.padEnd(size - 13, " ") + "|");
    console.log("|     PORT: " + this.port.toString().padEnd(size - 6, " ") + "|");
    console.log("|     " + "".padEnd(size, " ") + "|");
    console.log(" -----" + "".padEnd(size, "-"));
  }
}

module.exports = Server;