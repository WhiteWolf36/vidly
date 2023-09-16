const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Genere } = require("../models/genere");
const { Movie, validate } = require("../models/movie");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie cannot be found");
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genere = await Genere.findById(req.body.genereId);
  if (!genere) return res.status(404).send("Invalid Genere ID");
  const movie = new Movie({
    title: req.body.title,
    genere: {
      _id: genere._id,
      name: genere.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genere = await Genere.findById(req.body.genereId);
  if (!genere) return res.status(404).send("Invalid Genere ID");
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        genere: {
          _id: genere._id,
          name: genere.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
    },
    {
      new: true,
    }
  );
  if (!movie) return res.status(404).send("Cannot find the movie");
  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(404).send("Cannot find the movie with current id");
  res.send(movie);
});

module.exports = router;
