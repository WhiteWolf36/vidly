const express = require("express");
const { Rental } = require("../models/rental");
const auth = require("../middleware/auth");

const router = express.Router();
router.post("/", auth, async (req, res) => {
  if (!req.body.customerId) {
    return res.status(400).send("No customer Id found!");
  }
  if (!req.body.movieId) {
    return res.status(400).send("No customer Id found!");
  }
  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("No rental found!");
  if (rental.dateReturned) {
    return res.status(400).send("Rental is already proccessed");
  }
  rental.dateReturned = new Date();
  await rental.save();
  return res.status(200).send();
});

module.exports = router;
