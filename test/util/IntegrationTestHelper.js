let superagent = require("superagent");

/**
 * Helper dos Testes de Integração.
 *
 * @class IntegrationTestHelper
 */
class IntegrationTestHelper {

  /**
   * Cria uma nova instancia de IntegrationTestHelper.
   *
   * @memberof IntegrationTestHelper
   */
  constructor() {
    // this.accessTokenService = new AccessTokenService();
    // this.refreshTokenService = new RefreshTokenService();
    // this.clientService = new ClientService();
    // this.securityService = new SecurityService();
    // this.userService = new UserService({scope: ScopeEnum.MOBILE});

    /**
     * Testing Facebook Account (Access Token valido até: 26/08/2018).
     * # User: likindo.tests@gmail.com
     * # Password: ld12345678
     * # ID: 121827765306244
     */

    // this.FACEBOOK_USER_ID = "121827765306244";
    // this.FACEBOOK_ACCESS_TOKEN = "EAAMtZBvNQBdQBACn9wX4jw504Tj1mWBJXgAgBoH3ew609XMAKCrD99pZCtxaFAD7XLTkKIDhGLUyXr4oJWJ9lqHsf98YPVkINpljWJRW7FzbAddSUzQ03UHhin3syvSjeIzHzIxViKQZCLd8i47W3APdoUtrHNwlm6qHYoccAZDZD"
    // this.FACEBOOK_CLIENT_ID = "894980777313748";
    // this.FACEBOOK_CLIENT_SECRET = "d251b73c4cd54e614c2131738c0bfe8a";
    // this.FACEBOOK_REDIRECT_URI = "http://localhost/callback";
    // this.FACEBOOK_TOKEN_SECRET = Configuration.get("common", "security.user.facebook_token.secret");

    /**
     * Testing Google Account.
     * # User: likindo.tests@gmail.com
     * # Password: ld12345678
     * # ID: 103842391732472297549
     */

    // this.GOOGLE_USER_ID = "103842391732472297549";
    // this.GOOGLE_ACCESS_TOKEN;
    // this.GOOGLE_REFRESH_TOKEN = "1/KDyOzuVGdLIcvdAGDf9PZhJkqbBovi3dY-q3MXg2A8egcIHT6hF5Qi8mYVzmTHNG";
    // this.GOOGLE_CLIENT_ID = "34856286099-mgr3ue0klcgurj3cv736v3m8ucvv3kjc.apps.googleusercontent.com";
    // this.GOOGLE_CLIENT_SECRET = "-El8_Bdq0Lb0pFnOQkiz2BnJ";
    // this.GOOGLE_TOKEN_ENDPOINT = "https://www.googleapis.com/oauth2/v4/token";
    // this.GOOGLE_TOKEN_SECRET = Configuration.get("common", "security.user.google_token.secret");

    /**
     * Fakes
     */

    //this.fakeDevice = "Fake Device Id";
    //this.fakeAnotherDevice = "Fake Another Device Id";

    //this.fakeClient = {
    //  uuid: "29a00241-57ec-47ef-8d6b-89f1a573c31c",
    //  name: "Fake Client",
    //  secret: "secret",
    //  scope: ScopeEnum.MOBILE.value,
    //  active: 1,
    //  id_parent: null,
    //  id_store: null
    //};

    //this.fakeIntegrationClient = {
    //  uuid: "b1466dbd-7b52-4586-a088-84cb5c8522c1",
    //  name: "Fake Integration Client",
    //  secret: "secret",
    //  scope: ScopeEnum.INTEGRATION.value,
    //  active: 1,
    //  id_parent: 1,
    //  id_store: 1
    //};

    //this.fakeDataClient = {
    //  uuid: "ab2ecd54-e753-4215-9e3c-6b679e992278",
    //  name: "Fake Data Client",
    //  secret: "secret",
    //  scope: ScopeEnum.DATA.value,
    //  active: 1,
    //  id_parent: null,
    //  id_store: null
    //};

    //this.fakeAnotherClient = {
    //  uuid: "905b93e8-08ff-4751-8e14-d219e05db70b",
    //  name: "Fake Another Client",
    //  secret: "secret",
    //  scope: ScopeEnum.MOBILE.value,
    //  active: 1,
    //  id_parent: null,
    //  id_store: null
    //};

    //this.fakeInactiveClient = {
    //  uuid: "7e98c587-d703-441c-9b4c-84ad95f8f178",
    //  name: "Fake Inactive Client",
    //  secret: "secret",
    //  scope: ScopeEnum.MOBILE.value,
    //  active: 0,
    //  id_parent: null,
    //  id_store: null
    //};

    //this.fakeWrongScopeClient = {
    //  uuid: "8e5fb994-9600-49d2-bd65-808c2cb74f2a",
    //  name: "Fake Wrong Scope Client",
    //  secret: "secret",
    //  scope: ScopeEnum.INTEGRATION.value,
    //  active: 1,
    //  id_parent: null,
    //  id_store: null
    //};

    //this.fakeCustomer = {
    //  name: "Fake Name",
    //  email: "fake@email.com",
    //  password: "password",
    //  facebook_id: this.FACEBOOK_USER_ID,
    //  google_id: this.GOOGLE_USER_ID
    //};

    //this.fakeAccessToken = {
    //  token: this.accessTokenService.generateToken(),
    //  scope: ScopeEnum.MOBILE.value,
    //  device_id: this.fakeDevice,
    //  expires_at: moment().add(Configuration.get("common", "security.accessToken.lifetime." + ScopeEnum.MOBILE.value), "seconds").format()
    //};

    //this.fakeRefreshToken = {
    //  token: this.refreshTokenService.generateToken(),
    //  scope: ScopeEnum.MOBILE.value,
    //  device_id: this.fakeDevice,
    //  expires_at: moment().add(Configuration.get("common", "security.refreshToken.lifetime." + ScopeEnum.MOBILE.value), "seconds").format()
    //};

    //this.fakeExpiredRefreshToken = {
    //  token: this.refreshTokenService.generateToken(),
    //  scope: ScopeEnum.MOBILE.value,
    //  device_id: this.fakeDevice,
    //  expires_at: moment().subtract(1, "minutes").format()
    //};

    //this.fakeInvalidUserRefreshToken = {
    //  token: this.refreshTokenService.generateToken(),
    //  scope: ScopeEnum.MOBILE.value,
    //  device_id: this.fakeDevice,
    //  user_id: 0,
    //  expires_at: moment().add(Configuration.get("common", "security.refreshToken.lifetime." + ScopeEnum.MOBILE.value), "seconds").format()
    //};
  }

  /**
   * Cria e retorna uma Requisicao de Access e Refresh Tokens.
   *
   * @param {Object} client
   * @param {Object} [device]
   * @returns {Object}
   * @memberof IntegrationTestHelper
   */
  createTokenRequest(client, device) {
    let request = supertest.post("/oauth2/token")
      .set("Content-Type", "application/x-www-form-urlencoded");

    if (client) request = request.auth(client.uuid, client.secret);
    if (device) request = request.set("X-LD-DeviceId", device);

    return request;
  }

  /**
   * Cria e retorna uma Requisicao de Revogação de Access e Refresh Tokens.
   *
   * @returns {Object}
   * @memberof IntegrationTestHelper
   */
  createTokenRevokeRequest(client, device) {
    let request = supertest.post("/oauth2/token/revoke")
      .set("Content-Type", "application/x-www-form-urlencoded");

    if (client) request = request.auth(client.uuid, client.secret);
    if (device) request = request.set("X-LD-DeviceId", device);

    return request;
  }

  /**
   * Cria um Client Fake.
   *
   * @async
   * @param {JSON} fakeClient
   * @returns {Promise<Client>}
   * @memberof IntegrationTestHelp
   */
  async createClient(fakeClient) {
    let fakeHashedSecret = this.clientService.hash(fakeClient.secret, fakeClient.uuid);
    let fakeClientSecure = Object.assign({}, fakeClient, {
      secret: fakeHashedSecret
    });

    return Client.create(fakeClientSecure);
  }

  /**
   * Cria um Customer Fake.
   *
   * @async
   * @param {JSON} fakeCustomer
   * @returns {Promise<Customer>}
   * @memberof IntegrationTestHelper
   */
  async createCustomer(fakeCustomer) {
    await this.setGoogleAccessToken();

    let fakeCustomerSecure = Object.assign({}, fakeCustomer, {
      "password": this.userService.hash(fakeCustomer.password),
      "facebook_id": this.FACEBOOK_USER_ID,
      "facebook_token": this.securityService.encrypt(this.FACEBOOK_ACCESS_TOKEN, this.FACEBOOK_TOKEN_SECRET),
      "google_id": this.GOOGLE_USER_ID,
      "google_token": this.securityService.encrypt(this.GOOGLE_ACCESS_TOKEN, this.GOOGLE_TOKEN_SECRET)
    });

    return Customer.create(fakeCustomerSecure);
  }

  /**
   * Cria um Access Token Fake.
   *
   * @async
   * @param {JSON} fakeAccessToken
   * @param {Client} fakeClient
   * @param {Customer} fakeCustomer
   * @returns {Promise<AccessToken>}
   * @memberof IntegrationTestHelper
   */
  async createAccessToken(fakeAccessToken, fakeClient, fakeCustomer) {
    let fakeHashedToken = this.accessTokenService.hash(fakeAccessToken.token);
    let fakeAccessTokenSecure = Object.assign({}, fakeAccessToken, {
      token: fakeHashedToken,
    });

    if (fakeClient) Object.assign(fakeAccessTokenSecure, {client_id: fakeClient.id_client});
    if (fakeCustomer) Object.assign(fakeAccessTokenSecure, {user_id: fakeCustomer.id_customer});

    return new AccessToken(fakeAccessTokenSecure).save();
  }

  /**
   * Cria um Refresh Token Fake.
   *
   * @async
   * @param {JSON} fakeRefreshToken
   * @param {Client} fakeClient
   * @param {Customer} fakeCustomer
   * @returns {Promise<RefreshToken>}
   * @memberof IntegrationTestHelper
   */
  async createRefreshToken(fakeRefreshToken, fakeClient, fakeCustomer) {
    let fakeHashedToken = this.refreshTokenService.hash(fakeRefreshToken.token);
    let fakeRefreshTokenSecure = Object.assign({}, fakeRefreshToken, {
      token: fakeHashedToken,
    });

    if (fakeClient) Object.assign(fakeRefreshTokenSecure, {client_id: fakeClient.id_client});
    if (fakeCustomer) Object.assign(fakeRefreshTokenSecure, {user_id: fakeCustomer.id_customer});

    return new RefreshToken(fakeRefreshTokenSecure).save();
  }

  /**
   * Exclui um Client Fake.
   *
   * @async
   * @param {Client} fakeClient
   * @returns {Promise}
   * @memberof IntegrationTestHelper
   */
  async deleteClient(fakeClient) {
    return Client.destroy({where: {uuid: fakeClient.uuid}, force: true});
  }

  /**
   * Exclui um Customer Fake.
   *
   * @async
   * @param {Customer} fakeCustomer
   * @returns {Promise}
   * @memberof IntegrationTestHelper
   */
  async deleteCustomer(fakeCustomer) {
    return Customer.destroy({where: {email: fakeCustomer.email}, force: true});
  }

  /**
   * Exclui um Access Token Fake.
   *
   * @async
   * @param {AccessToken} fakeAccessToken
   * @returns {Promise}
   * @memberof IntegrationTestHelper
   */
  async deleteAccessToken(fakeAccessToken) {
    return AccessToken.remove(fakeAccessToken);
  }

  /**
   * Exclui um Refresh Token Fake.
   *
   * @async
   * @param {RefreshToken} fakeRefreshToken
   * @returns {Promise}
   * @memberof IntegrationTestHelper
   */
  async deleteRefreshToken(fakeRefreshToken) {
    return RefreshToken.remove(fakeRefreshToken);
  }

  /**
   * Exclui um Access Token conforme valor do Token.
   *
   * @async
   * @param {string} token
   * @returns {Promise}
   * @memberof IntegrationTestHelper
   */
  async deleteAccessTokenByToken(token) {
    return AccessToken.findOne({token}).then(accessToken => {
      return AccessToken.remove(accessToken);
    })
  }

  /**
   * Exclui um Refresh Token conforme valor do Token.
   *
   * @async
   * @param {string} token
   * @returns {Promise}
   * @memberof IntegrationTestHelper
   */
  async deleteRefreshTokenByToken(token) {
    return RefreshToken.findOne({token}).then(refreshToken => {
      return RefreshToken.remove(refreshToken);
    })
  }

  /**
   * Retorna o Access Token conforme valor do Token (hashed).
   *
   * @async
   * @param {string} token Hashed Token
   * @returns {Promise<AccessToken>}
   * @memberof IntegrationTestHelper
   */
  async getAccessTokenByToken(token) {
    return AccessToken.findOne({token});
  }

  /**
   * Retorna o Refresh Token conforme valor do Token (hashed).
   *
   * @async
   * @param {string} token  Hashed Token
   * @returns {Promise<RefreshToken>}
   * @memberof IntegrationTestHelper
   */
  async getRefreshTokenByToken(token) {
    return RefreshToken.findOne({token});
  }

  /**
   * Retorna um novo Access Token do Google.
   *
   * @async
   * @returns {Promise<string>}
   * @memberof IntegrationTestHelper
   */
  async setGoogleAccessToken() {
    return this.GOOGLE_ACCESS_TOKEN || superagent.post(this.GOOGLE_TOKEN_ENDPOINT)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({
        refresh_token: this.GOOGLE_REFRESH_TOKEN,
        grant_type: "refresh_token",
        client_id: this.GOOGLE_CLIENT_ID,
        client_secret: this.GOOGLE_CLIENT_SECRET
      })
      .then(response => {
        this.GOOGLE_ACCESS_TOKEN = response.body.access_token;
        return this.GOOGLE_ACCESS_TOKEN;
      });
  }
}

module.exports = IntegrationTestHelper;