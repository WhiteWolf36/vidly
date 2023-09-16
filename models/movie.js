const mongoose = require("mongoose");
const Joi = require("joi");
const { genereSchema } = require("./genere");

//const Genere = mongoose.model("genere", genereSchema);

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 255,
  },
  genere: {
    type: genereSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const Movie = mongoose.model("movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genereId: Joi.objectId().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  });
  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
