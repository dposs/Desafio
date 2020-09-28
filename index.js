let Server = require("./src/util/Server");

Server.create("Challenge").then(server => {
  server.start();
});