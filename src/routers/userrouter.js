const express = require("express");
const { getusers } = require("../controllers/userController"); // ✅ Correct import

const router = express.Router();

router.get("/", getusers); // ✅ Function name matches the import

module.exports = router;
