const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const supertest = require("supertest");

const Server = require("../../../src/util/Server");

/**
 * Server dos Testes de Integração.
 *
 * @class IntegrationTestServer
 */
class IntegrationTestServer {

  /**
   * Inicializa o Servidor como Singleton.
   *
   * @static
   * @async
   * @returns {Promise<Server>}
   * @memberof IntegrationTestServer
   */
  static async initialize() {
    if (this.server) return this.server;

    chai.use(chaiAsPromised);
    chai.should();

    this.server = await Server.create("Authorization Server");
    
    await this.server.start();

    let IntegrationTestHelper = require("./IntegrationTestHelper");

    global.helper = new IntegrationTestHelper();
    global.supertest = supertest(this.server.express);
    global.expect = chai.expect;
  }
}

module.exports = IntegrationTestServer;