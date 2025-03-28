const express = require("express");
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("Trip routes are working!");
});

module.exports = router;
