require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // Allow JSON requests
app.use(cors({ origin: "http://localhost:19006", credentials: true })); // Adjust for your frontend

// Import Routes
const userRoutes = require("../routes/userRoutes");
const tripRoutes = require("../routes/tripRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

// Test Route to Check Backend-FE Connection
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend is working!" });
});

// Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
