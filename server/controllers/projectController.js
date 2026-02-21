const pool = require("../db/connection");

// ===============================
// CREATE PROJECT
// ===============================
exports.createProject = async (req, res) => {
  try {
    const { client_id, project_name, description, price, status, deadline } = req.body;

    const result = await pool.query(
      `INSERT INTO projects 
       (user_id, client_id, project_name, description, price, status, deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, client_id, project_name, description, price, status, deadline]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// GET ALL PROJECTS (WITH CLIENT NAME)
// ===============================
exports.getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         p.id,
         p.project_name,
         p.price,
         p.status,
         p.deadline,
         c.name AS client_name
       FROM projects p
       JOIN clients c ON p.client_id = c.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// GET PROJECTS WITH PAYMENT SUMMARY
// ===============================
exports.getProjectSummary = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         p.id,
         p.project_name,
         p.price,
         COALESCE(SUM(pay.amount), 0) AS total_paid,
         p.price - COALESCE(SUM(pay.amount), 0) AS pending_amount
       FROM projects p
       LEFT JOIN payments pay ON p.id = pay.project_id
       WHERE p.user_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};