let _ = require("lodash");
let winston = require("winston");

/**
 * Logger (Singleton).
 * 
 * @requires module:winston
 * @requires module:winston-aws-cloudwatch
 * 
 * @class Logger
 * @extends {winston.Logger}
 */
class Logger extends winston.Logger {

  /**
   * Inicializa a instancia de Logger.
   * 
   * @static
   * @param {Object} config JSON de configuracao
   * @returns {winston.Logger}
   * @memberof Logger
   */
  static initialize(config) {
    winston.Logger.prototype.exception = Logger.exception;
    
    Logger.instance = new winston.Logger(config);
    Logger.instance.setLevels(winston.config.syslog.levels);

    // Console
    Logger.instance.add(winston.transports.Console, config.transport.Console);
    Logger.instance.transports.console.formatter = Logger.formatter;

    // File
    Logger.instance.add(winston.transports.File, config.transport.File);
    Logger.instance.transports.file.formatter = Logger.formatter;

    winston.addColors({
      emerg: "bold magenta",
      alert: "magenta",
      crit: "bold red",
      error: "red",
      warning: "yellow",
      notice: "blue",
      info: "green",
      debug: "italic cyan"
    });

    return Logger.instance;
  }

  /**
   * Retorna a instancia de Logger.
   * Inicializa uma nova instancia se nenhuma for encontrada.
   *
   * @static
   * @param {Object} [config] JSON de configuracao do Winston. Opcional se singleton ja estiver inicializado.
   * @returns {winston.Logger}
   * @memberof Logger
   */
  static getInstance(config) {
    if (Logger.instance) {
      return Logger.instance;
    }
    return Logger.initialize(config);
  }

  /**
   * Loga o erro e o seu stacktrace.
   * 
   * @static
   * @param {Error} error 
   * @param {Logger.<LEVEL>} [level = Logger.ERROR]
   * @memberof Logger
   */
  static exception(error, level = Logger.ERROR) {
    Logger.instance[level](error.message, {
      message: error.message,
      data: error.data,
      stack: error.stack,
      exception: true
    });
  }

  /**
   * Retorna o timestamp formatado.
   * 
   * @static
   * @returns {string} Timestamp formatado
   * @memberof Logger
   */
  static timestamp() {
    var options = {
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };

    return new Date(Date.now()).toLocaleDateString("pt-BR", options);
  }

  /**
   * Retorna a mensagem formatada de acordo com os dados provenientes do log Winston.
   * 
   * @static
   * @param {Object} data 
   * @returns {string} Mensagem formatada
   * @memberof Logger
   */
  static formatter(data) {
    let meta = data.meta;
    let message = Logger.timestamp() + " " + data.level.toUpperCase() + (data.message && data.message != "undefined" ? " : " + data.message : "");

    if (meta && !_.isEmpty(meta)) {
      if (meta.exception) {
        if (meta.data) message += "\n" + JSON.stringify(meta.data, null, 2);
        if (meta.stack) message += "\nStacktrace: " + meta.stack;
      } else {
        message += "\n" + JSON.stringify(meta, null, 2);
      }
    }

    return data.colorize ? winston.config.colorize(data.level, message) : message;
  }

  /**
   * Retorna a mensagem formatada em JSON de acordo com os dados provenientes do log Winston.
   * 
   * @static
   * @param {Object} data 
   * @returns {string} Mensagem formatada em JSON
   * @memberof Logger
   */
  static formatterJSON(data) {
    let meta = data.meta;
    let log = {
      "level": data.level
    };

    if (data.message) {
      Object.assign(log, {"message": data.message});
    }
    
    if (meta && !_.isEmpty(meta)) {
      if (meta.exception) {
        if (meta.data) Object.assign(log, {"data": meta.data});
        if (meta.stack) Object.assign(log, {"stack": meta.stack.split("\n")});
      } else {
        Object.assign(log, {"data": meta});
      }
    }

    return JSON.stringify(log);
  }
}

Logger.DEBUG = "debug";
Logger.INFO = "info";
Logger.NOTICE = "notice";
Logger.WARNING = "warning";
Logger.ERROR = "error";
Logger.CRITICAL = "crit";
Logger.ALERT = "alert";
Logger.EMERGENCIAL = "emerg";

module.exports = Logger;