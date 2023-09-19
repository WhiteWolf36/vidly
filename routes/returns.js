const express = require("express");

const router = express.Router();
router.post("/", async (req, res) => {
  if (!req.body.customerId) {
    return res.status(400).send("No customer Id found!");
  } else if (!req.body.movieId) {
    return res.status(400).send("No customer Id found!");
  }
  res.status(401).send("Unauthorized");
});

module.exports = router;
