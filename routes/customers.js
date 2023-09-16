const { Customer, validate } = require("../models/customer");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");

//Get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});
//Get a specific customer by its id
router.get("/:id", async (req, res) => {
  const customer = await Customer.find({ _id: req.params.id });
  if (!customer) return res.status(404).send("Customer cannot be found!");
  res.send(customer);
});
//Create a new customer
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await customer.save();
  res.send(customer);
});
//Updating a customer
router.put("/:id", auth, async (req, res) => {
  const customer = await Customer.find({ _id: req.params.id });
  if (!customer) return res.status(400).send("Cannot find the customer");
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  res.send(customer);
});
//Deleting a customer
router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(400).send("Cannot find the customer with the current id");
  res.send(customer);
});

module.exports = router;
