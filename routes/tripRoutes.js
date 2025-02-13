const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Trip route working!" }));
router.post("/create", (req, res) =>
  res.json({ message: "Create Trip endpoint" })
);

module.exports = router;
