const Server = require("./src/util/Server");

Server.create("Desafio Luizalabs").then(server => {
  server.start();
});