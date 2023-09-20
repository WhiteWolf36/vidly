const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log(`Connected to the database ${config.get("db")}`));
};
