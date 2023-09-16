const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 7,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().required().min(7).max(255).email(),
    password: Joi.string().required().min(8).max(255),
  });
  return schema.validate(user);
}

exports.validate = validateUser;
exports.User = User;
