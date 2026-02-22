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
// Middleware
// =====================
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      process.env.FRONTEND_URL, // production frontend
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());

// =====================
// API Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =====================
// Protected Test Route
// =====================
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully 🔐",
    user: req.user,
  });
});

// =====================
// Database Test Route
// =====================
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// Root Route
// =====================
app.get("/", (req, res) => {
  res.send("CreatorOS API Running 🚀");
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});