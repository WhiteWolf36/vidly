const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model(
  "Rental",
  mongoose.Schema({
    customer: {
      type: mongoose.Schema({
        name: {
          type: String,
          minLength: 5,
          maxLength: 50,
          required: true,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: Number,
          required: true,
          min: 5,
        },
      }),
      required: true,
    },
    movie: {
      type: mongoose.Schema({
        title: {
          type: String,
          required: true,
          minLength: 5,
          maxLEngth: 255,
          trim: true,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

exports.validate = validateRental;
exports.Rental = Rental;
