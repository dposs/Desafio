exports.server = {
  host: "localhost",
  port: 3003
};

exports.database = {
  mysql: {
    challenge: {
      dialect: "mysql",
      host: "localhost",
      port: 3306,
      database: "challenge",
      username: "root",
      password: "root",
      timezone : "+00:00",
      dialectOptions: {
        decimalNumbers: true
      },
      pool: {
    	  max: 11,
    	  min: 0,
    	  acquire: 30000,
    	  idle: 3000
  	  }
    }
  }
};

exports.localization = {
  language: "pt-BR"
};

exports.log = {
  level: "info",
  transport: {
    Console: {
      colorize: true
    },
    File: {
      filename: "server.log",
      colorize: false,
      json: false,
      maxsize: 10485760,
      maxFiles: 10,
      tailable: true,
      zippedArchive: true
    }
  }
};