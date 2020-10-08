let HttpStatus = require("http-status");

let ScopeEnum = require("../../../src/common/enum/ScopeEnum");
let GrantTypeEnum = require("../../../src/common/enum/GrantTypeEnum");

let Configuration = require("../../../src/common/util/Configuration");
let IntegrationTestServer = require("../../util/IntegrationTestServer");

before(async () => {
  await IntegrationTestServer.initialize();
});

describe("/oauth2/token", function() {

  let fakeClientDB;
  let fakeIntegrationClientDB;
  let fakeDataClientDB;
  let fakeAnotherClientDB;
  let fakeInactiveClientDB;
  let fakeWrongScopeClientDB;
  let fakeCustomerDB;
  let fakeRefreshTokenDB;
  let fakeExpiredRefreshTokenDB;
  let fakeInvalidUserRefreshTokenDB;

  let generatedAccessTokens = [];
  let generatedRefreshTokens = [];

  beforeEach((done) => {
    Promise.resolve().then(() => {
      return helper.createClient(helper.fakeClient).then(created => {
        return fakeClientDB = created;
      });

    }).then(() => {
      return helper.createClient(helper.fakeIntegrationClient).then(created => {
        return fakeIntegrationClientDB = created;
      });

    }).then(() => {
      return helper.createClient(helper.fakeDataClient).then(created => {
        return fakeDataClientDB = created;
      });

    }).then(() => {
      return helper.createClient(helper.fakeAnotherClient).then(created => {
        return fakeAnotherClientDB = created;
      });

    }).then(() => {
      return helper.createClient(helper.fakeInactiveClient).then(created => {
        return fakeInactiveClientDB = created;
      });

    }).then(() => {
      return helper.createClient(helper.fakeWrongScopeClient).then(created => {
        return fakeWrongScopeClientDB = created;
      });

    }).then(() => {
      return helper.createCustomer(helper.fakeCustomer).then(created => {
        return fakeCustomerDB = created;
      });

    }).then(() => {
      return helper.createRefreshToken(helper.fakeRefreshToken, fakeClientDB, fakeCustomerDB).then(created => {
        return fakeRefreshTokenDB = created;
      });

    }).then(() => {
      return helper.createRefreshToken(helper.fakeExpiredRefreshToken, fakeClientDB, fakeCustomerDB).then(created => {
        return fakeExpiredRefreshTokenDB = created;
      });

    }).then(() => {
      return helper.createRefreshToken(helper.fakeInvalidUserRefreshToken, fakeClientDB, null).then(created => {
        return fakeInvalidUserRefreshTokenDB = created;
      });

    }).then(() => {
      return helper.setGoogleAccessToken();

    }).then(() => done());
  });

  afterEach((done) => {
    Promise.resolve().then(() => {
      return helper.deleteClient(fakeClientDB);

    }).then(() => {
      return helper.deleteClient(fakeIntegrationClientDB);

    }).then(() => {
      return helper.deleteClient(fakeDataClientDB);

    }).then(() => {
      return helper.deleteClient(fakeAnotherClientDB);

    }).then(() => {
      return helper.deleteClient(fakeInactiveClientDB);

    }).then(() => {
      return helper.deleteClient(fakeWrongScopeClientDB);

    }).then(() => {
      return helper.deleteCustomer(fakeCustomerDB);

    }).then(() => {
      return helper.deleteRefreshToken(fakeRefreshTokenDB)

    }).then(() => {
      return helper.deleteRefreshToken(fakeExpiredRefreshTokenDB)

    }).then(() => {
      return helper.deleteRefreshToken(fakeInvalidUserRefreshTokenDB)

    }).then(() => {
      let promises = [];

      for (let token in generatedAccessTokens) {
        promises.push(
          helper.deleteAccessTokenByToken(token)
        );
      }

      for (let token in generatedRefreshTokens) {
        promises.push(
          helper.deleteRefreshTokenByToken(token)
        );
      }

      generatedAccessTokens = [];
      generatedRefreshTokens = [];

      return Promise.all(promises);

    }).then(() => done());
  });

  it("Any Grant Type: should not give access to endpoint when Client credentials are invalid.", function(done) {
    let fakeInvalidClient = Object.assign({}, helper.fakeClient, {secret: "wrong secret"});
    let request = helper.createTokenRequest(fakeInvalidClient, helper.fakeDevice).send()
      .expect(HttpStatus.UNAUTHORIZED)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_client");
    }).should.notify(done);
  });

  it("Any Grant Type: should not give access to endpoint when Client is not active.", function(done) {
    let request = helper.createTokenRequest(helper.fakeInactiveClient, helper.fakeDevice).send()
      .expect(HttpStatus.UNAUTHORIZED)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_client");
    }).should.notify(done);
  });

  it("Any Grant Type: should not exchange credentials for an Access Token when Scope doesn't allow the Grant Type being used.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: ScopeEnum.MOBILE.grants[0].value,
        username: helper.fakeCustomer.email,
        password: helper.fakeCustomer.password,
        scope: ScopeEnum.INTEGRATION.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Grant Type 'Password': should exchange a User Password for an Access Token.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.PASSWORD.value,
        username: helper.fakeCustomer.email,
        password: helper.fakeCustomer.password,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.OK)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      generatedAccessTokens.push(response.body.access_token);
      generatedRefreshTokens.push(response.body.refresh_token);

      expect(response.body).to.have.property("access_token").that.is.lengthOf(128);
      expect(response.body).to.have.property("refresh_token").that.is.lengthOf(128);
      expect(response.body).to.have.property("scope", ScopeEnum.MOBILE.value)
      expect(response.body).to.have.property("expires_in", Configuration.get("common", "security.accessToken.lifetime.mobile"));
      expect(response.body).to.have.property("token_type", "Bearer");

    }).should.notify(done);
  });

  it("Grant Type 'Password': should not exchange a User Password for an Access Token when User credentials are not provided.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.PASSWORD.value,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_request");
    }).should.notify(done);
  });

  it("Grant Type 'Password': should not exchange a User Password for an Access Token when User credentials are invalid.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.PASSWORD.value,
        username: helper.fakeCustomer.email,
        password: "wrong password",
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Grant Type 'Password': should not exchange a User Password for an Access Token when Device is not provided.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient)
      .send({
        grant_type: GrantTypeEnum.PASSWORD.value,
        username: helper.fakeCustomer.email,
        password: helper.fakeCustomer.password,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_request");
    }).should.notify(done);
  });

  it("Grant Type 'Password': should not exchange a User Password for an Access Token when the Client is not authorized to use the Scope 'mobile'.", function(done) {
    let request = helper.createTokenRequest(helper.fakeWrongScopeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.PASSWORD.value,
        username: helper.fakeCustomer.email,
        password: helper.fakeCustomer.password,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("unauthorized_client");
    }).should.notify(done);
  });

  it("Grant Type 'Password': should not exchange a User Password for an Access Token when scope is invalid.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.PASSWORD.value,
        username: helper.fakeCustomer.email,
        password: helper.fakeCustomer.password,
        scope: "wrong scope"
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_scope");
    }).should.notify(done);
  });

  it("Grant Type 'Refresh Token': should exchange a Refresh Token for an Access Token.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.REFRESH_TOKEN.value,
        refresh_token: helper.fakeRefreshToken.token,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.OK)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      generatedAccessTokens.push(response.body.access_token);
      generatedRefreshTokens.push(response.body.refresh_token);

      expect(response.body).to.have.property("access_token").that.is.lengthOf(128);
      expect(response.body).to.have.property("refresh_token").that.is.lengthOf(128);
      expect(response.body).to.have.property("scope", ScopeEnum.MOBILE.value)
      expect(response.body).to.have.property("expires_in", Configuration.get("common", "security.accessToken.lifetime." + ScopeEnum.MOBILE.value));
      expect(response.body).to.have.property("token_type", "Bearer");

    }).should.notify(done);
  });

  it("Grant Type 'Refresh Token': should not exchange a Refresh Token for an Access Token when Token is not provided.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.REFRESH_TOKEN.value,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_request");
    }).should.notify(done);
  });

  it("Grant Type 'Refresh Token': should not exchange a Refresh Token for an Access Token when Token is invalid.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.REFRESH_TOKEN.value,
        refresh_token: "wrong refresh token",
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Grant Type 'Refresh Token': should not exchange a Refresh Token for an Access Token when Token is expired.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.REFRESH_TOKEN.value,
        refresh_token: helper.fakeExpiredRefreshToken.token,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Grant Type 'Refresh Token': should not exchange a Refresh Token for an Access Token when authenticated Client is different from the Refresh Token Client.", function(done) {
    let request = helper.createTokenRequest(helper.fakeAnotherClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.REFRESH_TOKEN.value,
        refresh_token: helper.fakeRefreshToken.token,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Grant Type 'Refresh Token': should not exchange a Refresh Token for an Access Token when provided Device is different from the Refresh Token Device.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeAnotherDevice)
      .send({
        grant_type: GrantTypeEnum.REFRESH_TOKEN.value,
        refresh_token: helper.fakeRefreshToken.token,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Grant Type 'Refresh Token': should not exchange a Refresh Token for an Access Token when Refresh Token User is invalid or inexistent.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.REFRESH_TOKEN.value,
        refresh_token: helper.fakeInvalidUserRefreshToken.token,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Grant Type 'Google Token': should exchange a Google Token for an Access Token.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.GOOGLE.value,
        token: helper.GOOGLE_ACCESS_TOKEN,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.OK)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      generatedAccessTokens.push(response.body.access_token);
      generatedRefreshTokens.push(response.body.refresh_token);

      expect(response.body).to.have.property("access_token").that.is.lengthOf(128);
      expect(response.body).to.have.property("refresh_token").that.is.lengthOf(128);
      expect(response.body).to.have.property("scope", ScopeEnum.MOBILE.value)
      expect(response.body).to.have.property("expires_in", Configuration.get("common", "security.accessToken.lifetime.mobile"));
      expect(response.body).to.have.property("token_type", "Bearer");

    }).should.notify(done);
  });

  it("Grant Type 'Google Token': should not exchange a Google Token for an Access Token when Google Token is not provided.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.GOOGLE.value,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_request");
    }).should.notify(done);
  });

  it("Grant Type 'Google Token': should not exchange a Google Token for an Access Token when Google Token is invalid.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.GOOGLE.value,
        token: "invalid token",
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Grant Type 'Google Token': should not exchange a Google Token for an Access Token when Google User doesn't match any Likin.do User.", function(done) {
    helper.deleteCustomer(fakeCustomerDB).then(() => {
      let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
        .send({
          grant_type: GrantTypeEnum.GOOGLE.value,
          token: helper.GOOGLE_ACCESS_TOKEN,
          scope: ScopeEnum.MOBILE.value
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect("Content-Type", "application/json");

      expect(request).to.be.fulfilled.then(response => {
        expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
      }).should.notify(done);
    });
  });

  it("Grant Type 'Facebook Token': should exchange a Facebook Token for an Access Token.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.FACEBOOK.value,
        token: helper.FACEBOOK_ACCESS_TOKEN,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.OK)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      generatedAccessTokens.push(response.body.access_token);
      generatedRefreshTokens.push(response.body.refresh_token);

      expect(response.body).to.have.property("access_token").that.is.lengthOf(128);
      expect(response.body).to.have.property("refresh_token").that.is.lengthOf(128);
      expect(response.body).to.have.property("scope", ScopeEnum.MOBILE.value)
      expect(response.body).to.have.property("expires_in", Configuration.get("common", "security.accessToken.lifetime.mobile"));
      expect(response.body).to.have.property("token_type", "Bearer");

    }).should.notify(done);
  });

  it("Grant Type 'Facebbok Token': should not exchange a Facebook Token for an Access Token when Facebook Token is not provided.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.FACEBOOK.value,
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_request");
    }).should.notify(done);
  });

  it("Grant Type 'Facebook Token': should not exchange a Facebook Token for an Access Token when Facebook Token is invalid.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.FACEBOOK.value,
        token: "invalid token",
        scope: ScopeEnum.MOBILE.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Grant Type 'Facebook Token': should not exchange a Facebook Token for an Access Token when Facebook User doesn't match any Likin.do User.", function(done) {
    helper.deleteCustomer(fakeCustomerDB).then(() => {
      let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
        .send({
          grant_type: GrantTypeEnum.FACEBOOK.value,
          token: helper.FACEBOOK_ACCESS_TOKEN,
          scope: ScopeEnum.MOBILE.value
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect("Content-Type", "application/json");

      expect(request).to.be.fulfilled.then(response => {
        expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
      }).should.notify(done);
    });
  });

  it("Grant Type 'Client Credentials': should exchange Client Credentials for an Access Token of 'integration' scope.", function(done) {
    let request = helper.createTokenRequest(helper.fakeIntegrationClient)
      .send({
        grant_type: GrantTypeEnum.CLIENT_CREDENTIALS.value,
        scope: ScopeEnum.INTEGRATION.value
      })
      .expect(HttpStatus.OK)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      generatedAccessTokens.push(response.body.access_token);

      expect(response.body).to.have.property("access_token").that.is.lengthOf(128);
      expect(response.body).to.not.have.property("refresh_token");
      expect(response.body).to.have.property("scope", ScopeEnum.INTEGRATION.value)
      expect(response.body).to.not.have.property("expires_in");
      expect(response.body).to.have.property("token_type", "Bearer");

    }).should.notify(done);
  });

  it("Grant Type 'Client Credentials': should exchange Client Credentials for an Access Token of 'data' scope.", function(done) {
    let request = helper.createTokenRequest(helper.fakeDataClient)
      .send({
        grant_type: GrantTypeEnum.CLIENT_CREDENTIALS.value,
        scope: ScopeEnum.DATA.value
      })
      .expect(HttpStatus.OK)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      generatedAccessTokens.push(response.body.access_token);

      expect(response.body).to.have.property("access_token").that.is.lengthOf(128);
      expect(response.body).to.not.have.property("refresh_token");
      expect(response.body).to.have.property("scope", ScopeEnum.DATA.value)
      expect(response.body).to.not.have.property("expires_in");
      expect(response.body).to.have.property("token_type", "Bearer");

    }).should.notify(done);
  });

  it("Grant Type 'Client Credentials': should not exchange Client Credentials for an Access Token when the Client is not authorized to use the Scope 'integration'.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient)
      .send({
        grant_type: GrantTypeEnum.CLIENT_CREDENTIALS.value,
        scope: ScopeEnum.INTEGRATION.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("unauthorized_client");
    }).should.notify(done);
  });

  it("Grant Type 'Client Credentials': should not exchange Client Credentials for an Access Token when the Client is not authorized to use the Scope 'data'.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient)
      .send({
        grant_type: GrantTypeEnum.CLIENT_CREDENTIALS.value,
        scope: ScopeEnum.DATA.value
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("unauthorized_client");
    }).should.notify(done);
  });

  it("Grant Type 'Client Credentials': should not exchange Client Credentials for an Access Token when scope is invalid.", function(done) {
    let request = helper.createTokenRequest(helper.fakeClient, helper.fakeDevice)
      .send({
        grant_type: GrantTypeEnum.CLIENT_CREDENTIALS.value,
        scope: "wrong scope"
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_scope");
    }).should.notify(done);
  });
});