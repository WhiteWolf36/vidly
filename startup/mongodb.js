const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  mongoose
    .connect(config.get("db"))
    .then(() => console.log(`Connected to the database ${config.get("db")}`));
};
