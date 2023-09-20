const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
module.exports = function () {
  const db = process.env.MONGODB_URI;
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "unhandledExceptions.log" })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(new winston.transports.MongoDB({ db }));
};
