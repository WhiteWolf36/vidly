const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Genere, validate } = require("../models/genere");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");

//Getting all the Generes
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const generes = await Genere.find();
    res.send(generes);
  })
);

//Getting a specific Genere
router.get("/:id", validateObjectId, async (req, res) => {
  const genere = await Genere.find({ _id: req.params.id });
  if (!genere) return res.status(404).send("Genere Not Found!");
  res.send(genere);
});

//Creating a new Genere
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const genere = new Genere({
    name: req.body.name,
  });
  await genere.save();
  res.send(genere);
});

//Updating a specific Genere
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const genere = await Genere.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
      },
    },
    {
      new: true,
    }
  );
  if (!genere) return res.status(404).send("Genere Not Found!");
  res.send(genere);
});

//Deleting a specific Genere
router.delete("/:id", [auth, admin], async (req, res) => {
  const genere = await Genere.findByIdAndRemove(req.params.id);
  if (!genere)
    return res.status(400).send("Cannot find the genere with the current id");
  res.send(genere);
});

module.exports = router;
