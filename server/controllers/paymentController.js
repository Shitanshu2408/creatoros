const pool = require("../db/connection");

// ===============================
// ADD PAYMENT
// ===============================
exports.addPayment = async (req, res) => {
  try {
    const { project_id, amount, payment_date, payment_method, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO payments 
       (project_id, amount, payment_date, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [project_id, amount, payment_date, payment_method, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// GET MONTHLY REVENUE (USER SCOPED)
// ===============================
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         DATE_TRUNC('month', pay.payment_date) AS month,
         SUM(pay.amount) AS revenue
       FROM payments pay
       JOIN projects p ON pay.project_id = p.id
       WHERE p.user_id = $1
       GROUP BY month
       ORDER BY month DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// GET TOP CLIENTS BY REVENUE
// ===============================
exports.getTopClients = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         c.id,
         c.name AS client_name,
         COALESCE(SUM(pay.amount), 0) AS total_revenue
       FROM clients c
       LEFT JOIN projects p ON c.id = p.client_id
       LEFT JOIN payments pay ON p.id = pay.project_id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY total_revenue DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// REVENUE BETWEEN DATE RANGE
// ===============================
exports.getRevenueByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const result = await pool.query(
      `SELECT 
         SUM(pay.amount) AS total_revenue
       FROM payments pay
       JOIN projects p ON pay.project_id = p.id
       WHERE p.user_id = $1
       AND pay.payment_date BETWEEN $2 AND $3`,
      [req.user.id, start_date, end_date]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};