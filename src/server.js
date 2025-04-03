require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json()); // Allow JSON requests
app.use(cors({ origin: "http://localhost:19006", credentials: true })); // Adjust for your frontend

// Import Routes
const authRoutes = require(path.join(__dirname, "routers", "authRouter"));
const userRoutes = require(path.join(__dirname, "routers", "userrouter"));
const tripRoutes = require(path.join(__dirname, "routers", "tripRoutes"));
const testRoute = require(path.join(__dirname, "routers", "testroute"));

// Use Routes
app.use("/api/auth", authRoutes); // Authentication routes (Sign-up, Sign-in)
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/", testRoute);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend is working!" });
});

// Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

const { supabase } = require("./config/supabaseClient"); // Correct import

// Test Supabase Connection
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("❌ Supabase connection error:", error.message);
    } else {
      console.log("✅ Supabase connection successful:", data);
    }
  } catch (err) {
    console.error("❌ Unexpected Supabase error:", err);
  }
};

testSupabaseConnection();
