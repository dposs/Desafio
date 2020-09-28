let cors = require("cors");
let express = require("express");
let i18next = require("i18next");
let i18nextFSBackend = require("i18next-node-fs-backend");

let Configuration = require("./Configuration");
let DataSource = require("../util/DataSource");
let DataSourceORMEnum = require("../enum/DataSourceORMEnum");
let Logger = require("./Logger");

let InternalError = require("../error/InternalError");

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
    server.logger = Logger.initialize(Configuration.get("log"));

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
      .catch(error => this.logger.exception(error, Logger.EMERGENCIAL));
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
      .load("common/schema/database/sequelize").except("AbstractSequelizeSchema")
      .exec(Schema => mySQL.addSchema(new Schema(), {initializeModel: true}));

    Object.values(mySQL.schemas).forEach(schema => {
      schema.associate(mySQL.models);
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
  }

  /**
   * Exibe informacao de inicializacao do Servidor.
   *
   * @memberof Server
   */
  showStartupInfo() {
    let size = this.name.length + 12;

    console.log(" -----" + "".padEnd(size, "-"));
    console.log("|     " + "".padEnd(size, " ") + "|");
    console.log("|     " + this.name + " ONLINE" + "     |");
    console.log("|     ENVIRONMENT: " + this.environment.padEnd(size - 13, " ") + "|");
    console.log("|     PORT: " + this.port.toString().padEnd(size - 6, " ") + "|");
    console.log("|     " + "".padEnd(size, " ") + "|");
    console.log(" -----" + "".padEnd(size, "-"));
  }
}

module.exports = Server;