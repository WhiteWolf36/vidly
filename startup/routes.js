const express = require("express");
const generes = require("../routes/generes");
const home = require("../routes/home");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rental = require("../routes/rentals");
const user = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/generes", generes);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rental);
  app.use("/api/users", user);
  app.use("/api/auth", auth);
  app.use("/", home);
  app.use(error);
};
