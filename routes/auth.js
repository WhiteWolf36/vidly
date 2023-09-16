const bcrypt = require("bcrypt");
// const _ = require("lodash");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const _ = require("lodash");
const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const router = express.Router();
const config = require("config");
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().required().min(7).max(255).email(),
    password: Joi.string().required().min(8).max(255),
  });
  return schema.validate(user);
}
module.exports = router;
