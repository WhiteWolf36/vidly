const express = require("express");
const mongoose = require("mongoose");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not Found!");
  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);
  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res
      .status(404)
      .send("Can not found the customer with the provided Id");
  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(404).send("Cannot find the movie with the provided Id");
  const numberInStock = movie.numberInStock;
  const rental = new Rental({
    customer: {
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
      _id: customer._id,
    },
    movie: {
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
      _id: movie._id,
    },
    dateOut: req.body.dateOut,
    dateReturned: req.body.dateReturned,
    rentalFee: req.body.rentalFee,
  });
  await Movie.findByIdAndUpdate(req.body.movieId, {
    $set: {
      numberInStock: numberInStock - 1,
    },
  });
  await rental.save();
  res.send(rental);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Cannot find the customer");
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Cannot find the movie");
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        customer: {
          name: customer.name,
          isGold: customer.isGold,
          phone: customer.phone,
        },
        movie: {
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
        },
        dateOut: req.body.dateOut,
        dateReturned: req.body.dateReturned,
        rentalFee: req.body.rentalFee,
      },
    },
    {
      new: true,
    }
  );
  if (!rental) return res.status(404).send("Cannot find the rent");
  res.send(rental);
});

router.delete("/:id", auth, async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental) return res.status(404).send("Cannot find the rent.");
  res.send(rental);
});

module.exports = router;
