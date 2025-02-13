const express = require("express");
const router = express.Router();

// Example routes
router.get("/", (req, res) => res.json({ message: "User route working!" }));
router.post("/signup", (req, res) => res.json({ message: "Signup endpoint" }));
router.post("/login", (req, res) => res.json({ message: "Login endpoint" }));

module.exports = router;
