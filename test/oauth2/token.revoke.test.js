let HttpStatus = require("http-status");

let IntegrationTestServer = require("../../util/IntegrationTestServer");

before(async () => {
  await IntegrationTestServer.initialize();
});

describe("/oauth2/token/revoke", function() {

  let fakeClientDB;
  let fakeAnotherClientDB;
  let fakeInactiveClientDB;
  let fakeWrongScopeClientDB;
  let fakeCustomerDB;
  let fakeAccessTokenDB;
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
      return helper.createAccessToken(helper.fakeAccessToken, fakeClientDB, fakeCustomerDB).then(created => {
        return fakeAccessTokenDB = created;
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

    }).then(() => done())
    .catch(error => {
      console.log(error);
    });
  });

  afterEach((done) => {
    Promise.resolve().then(() => {
      return helper.deleteClient(fakeClientDB);

    }).then(() => {
      return helper.deleteClient(fakeAnotherClientDB);

    }).then(() => {
      return helper.deleteClient(fakeInactiveClientDB);

    }).then(() => {
      return helper.deleteClient(fakeWrongScopeClientDB);

    }).then(() => {
      return helper.deleteCustomer(fakeCustomerDB);

    }).then(() => {
      return helper.deleteAccessToken(fakeAccessTokenDB)

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

    }).then(() => done()).catch(error => {
      console.log(error);
    });
  });

  it("Any Revoke Type: should not give access to endpoint when Client credentials are invalid.", function(done) {
    let fakeInvalidClient = Object.assign({}, helper.fakeClient, {secret: "wrong secret"});
    let request = helper.createTokenRevokeRequest(fakeInvalidClient, helper.fakeDevice)
      .send({token: helper.fakeRefreshToken.token})
      .expect(HttpStatus.UNAUTHORIZED)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_client");
    }).should.notify(done);
  });

  it("Any Revoke Type: should not give access to endpoint when Client is not active.", function(done) {
    let request = helper.createTokenRevokeRequest(helper.fakeInactiveClient, helper.fakeDevice)
      .send({token: helper.fakeRefreshToken.token})
      .expect(HttpStatus.UNAUTHORIZED)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_client");
    }).should.notify(done);
  });

  it("Any Revoke Type: should not revoke Access and Refresh Tokens when authenticated Client is different from the Token Client.", function(done) {
    let request = helper.createTokenRevokeRequest(helper.fakeAnotherClient, helper.fakeDevice)
      .send({token: helper.fakeRefreshToken.token})
      .expect(HttpStatus.BAD_REQUEST)
      .expect("Content-Type", "application/json");

    expect(request).to.be.fulfilled.then(response => {
      expect(response.body).to.have.property("error").that.is.equal("invalid_grant");
    }).should.notify(done);
  });

  it("Any Revoke Type: should not return errors when an invalid Token is sent.", function(done) {
    let request = helper.createTokenRevokeRequest(helper.fakeAnotherClient, helper.fakeDevice)
      .send({token: "invalid token"})
      .expect(HttpStatus.OK);

    expect(request).to.be.fulfilled.notify(done);
  });

  it("Revoke Type 'Access Token': should revoke Access and Refresh Tokens.", function(done) {
    let request = helper.createTokenRevokeRequest(helper.fakeClient, helper.fakeDevice)
      .send({token: helper.fakeAccessToken.token})
      .expect(HttpStatus.OK);

    expect(request).to.be.fulfilled
      .then(() => {
        let accessTokenPromise = helper.getAccessTokenByToken(fakeAccessTokenDB.token);
        return expect(accessTokenPromise).to.be.fulfilled.then(accessToken => {
          expect(accessToken).to.be.null;
        });

      })
      .then(() => {
        let refreshTokenPromise = helper.getRefreshTokenByToken(fakeRefreshTokenDB.token);
        return expect(refreshTokenPromise).to.be.fulfilled.then(refreshToken => {
          expect(refreshToken).to.be.null;
        });
      })
      .should.notify(done);
  });

  it("Revoke Type 'Refresh Token': should revoke Access and Refresh Tokens.", function(done) {
    let request = helper.createTokenRevokeRequest(helper.fakeClient, helper.fakeDevice)
      .send({token: helper.fakeRefreshToken.token})
      .expect(HttpStatus.OK);

    expect(request).to.be.fulfilled
      .then(() => {
        let accessTokenPromise = helper.getAccessTokenByToken(fakeAccessTokenDB.token);
        return expect(accessTokenPromise).to.be.fulfilled.then(accessToken => {
          expect(accessToken).to.be.null;
        });

      })
      .then(() => {
        let refreshTokenPromise = helper.getRefreshTokenByToken(fakeRefreshTokenDB.token);
        return expect(refreshTokenPromise).to.be.fulfilled.then(refreshToken => {
          expect(refreshToken).to.be.null;
        });
      })
      .should.notify(done);
  });
});
