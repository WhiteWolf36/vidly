const express = require("express");
const { Rental } = require("../models/rental");

const router = express.Router();
router.post("/", async (req, res) => {
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
  if (!rental) res.status(404).send("No rental found!");
  res.status(401).send("Unauthorized");
});

module.exports = router;
