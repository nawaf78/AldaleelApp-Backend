require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, {
    body: req.body,
    query: req.query,
  });
  next();
});

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

const authRoutes = require(path.join(__dirname, "routers", "authRouter"));
const userRoutes = require(path.join(__dirname, "routers", "userrouter"));
const tripRoutes = require(path.join(__dirname, "routers", "tripRoutes"));

app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend is working!" });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const { supabase } = require("./config/supabaseClient"); 
  
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
