const Joi = require("joi");
const mongoose = require("mongoose");
const Customer = mongoose.model(
  "customer",
  mongoose.Schema({
    isGold: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 255,
    },
    phone: {
      type: Number,
      required: true,
      min: 7,
    },
  })
);

//Input validation
function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    isGold: Joi.boolean(),
    phone: Joi.number().min(7).required(),
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
