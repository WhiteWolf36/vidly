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
  if (!rental) return res.status(404).send("No rental found!");
  if (rental.dateReturned) {
    return res.status(400).send("Rental is already proccessed");
  }
  res.status(401).send("Unauthorized");
});

module.exports = router;
