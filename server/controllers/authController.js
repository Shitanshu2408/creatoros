const pool = require("../db/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";


// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields required"
      });
    }

    // check existing user
    const existing = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // FIXED COLUMN NAME HERE ↓↓↓
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id,name,email",
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
      token
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      error: err.message
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const user = result.rows[0];

    // FIXED COLUMN NAME HERE ↓↓↓
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      error: err.message
    });
  }
};