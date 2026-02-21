const pool = require("../db/connection");

// CREATE CLIENT
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    const result = await pool.query(
      `INSERT INTO clients (user_id, name, email, phone, company)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, name, email, phone, company]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL CLIENTS FOR USER
exports.getClients = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};