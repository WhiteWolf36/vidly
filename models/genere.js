const Joi = require("joi");
const mongoose = require("mongoose");

const genereSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
});
const Genere = mongoose.model("genere", genereSchema);

function validateGenere(genere) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genere);
}

exports.Genere = Genere;
exports.validate = validateGenere;
exports.genereSchema = genereSchema;
