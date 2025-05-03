require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, {
    body: req.body,
    query: req.query,
  });
  next();
});

// Error Handling Middleware for JSON payload
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "Invalid JSON payload",
      details: err.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Internal server error",
    details: err.message,
  });
});

// Import Routes
const authRoutes = require(path.join(__dirname, "routers", "authRouter"));
const userRoutes = require(path.join(__dirname, "routers", "userrouter"));
const tripRoutes = require(path.join(__dirname, "routers", "tripRoutes"));

// Use Routes
app.use("/api/auth", authRoutes); // Authentication routes (Sign-up, Sign-in)
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend is working!" });
});

// Error Handling Middleware
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
      console.log("✅ Supabase connection successful:");
    }
  } catch (err) {
    console.error("❌ Unexpected Supabase error:", err);
  }
};

testSupabaseConnection();
