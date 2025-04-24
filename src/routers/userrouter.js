// /profile route
const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");
const { updateProfile } = require('../controllers/userController');
const authenticate = require("../middleware/authMiddleware");

router.get("/profile", authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
module.exports = router;
