const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db/connection");

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();


// =====================
// CORS CONFIGURATION (FULLY FIXED)
// =====================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://creator-os-cyan.vercel.app", // your current vercel domain
  "https://creatoros.vercel.app", // optional future domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// =====================
// MIDDLEWARE
// =====================

app.use(express.json());


// =====================
// TEST ROUTES
// =====================

// test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// test users table
app.get("/test-users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json({
      success: true,
      users: result.rows,
    });
  } catch (err) {
    console.error("USERS ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


// =====================
// API ROUTES
// =====================

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);


// =====================
// PROTECTED ROUTE TEST
// =====================

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully 🔐",
    user: req.user,
  });
});


// =====================
// ROOT ROUTE
// =====================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CreatorOS API Running 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});


// =====================
// START SERVER
// =====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CreatorOS Server running on port ${PORT}`);
});