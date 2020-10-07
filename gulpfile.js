const spawn = require("child_process").spawn;
const { lookpath } = require("lookpath");

const Configuration = require("./src/util/Configuration");

/**
 * Instalação do Banco de Dados.
 *
 * @async
 * @param {function} cb
 */
async function install(cb) {
  let database = Configuration
    .load("./config")
    .get("database.mysql.challenge");
  
  if (!await lookpath("mysql")) {
    return cb(new Error("O comando 'mysql' deve estar disponível no path."));
  }

  var mysql = spawn("mysql", [
    "-u" + database.username,
    "-p" + database.password,
    "-h" + database.host,
    "--default-character-set=utf8",
    "--comments"
  ]);

  mysql.stdin.write("\\. ./database/install.sql");
  mysql.stdin.end();

  return mysql;
}

exports.install = install;