const express = require("express");
require("dotenv").config();
require("express-async-errors");
//require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();

const app = express();
require("./startup/mongodb")();
require("./startup/routes")(app);
require("./startup/prod")(app);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("Listening on Port 3000");
});

module.exports = server;
