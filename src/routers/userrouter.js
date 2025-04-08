const express = require("express");
const { getusers } = require("../controllers/userController");

const router = express.Router();

router.get("/", getusers); // ✅ Function name matches the import

module.exports = router;
