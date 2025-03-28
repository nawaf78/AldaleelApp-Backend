// src/routes/testRouter.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// Test database connection
router.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*"); // Test by querying the "users" table
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: "Supabase connection successful", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
