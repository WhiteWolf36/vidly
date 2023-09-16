const express = require("express");
require("dotenv").config();
require("express-async-errors");
require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();

const app = express();
require("./startup/mongodb")();
require("./startup/routes")(app);

const server = app.listen(3000, () => {
  console.log("Listening on Port 3000");
});

module.exports = server;
