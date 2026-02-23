const pool = require("../db/connection");


// ===============================
// ADD PAYMENT
// ===============================
exports.addPayment = async (req, res) => {
  try {

    const {
      project_id,
      amount,
      payment_date,
      payment_method,
      notes
    } = req.body;

    const result = await pool.query(
      `INSERT INTO payments
       (project_id, amount, payment_date, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        project_id,
        amount,
        payment_date,
        payment_method,
        notes
      ]
    );

    res.status(201).json({
      success: true,
      payment: result.rows[0]
    });

  } catch (err) {

    console.error("ADD PAYMENT ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



// ===============================
// GET ALL PAYMENTS (NEW)
// ===============================
exports.getPayments = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT pay.*
       FROM payments pay
       JOIN projects p ON pay.project_id = p.id
       WHERE p.user_id = $1
       ORDER BY pay.payment_date DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {

    console.error("GET PAYMENTS ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



// ===============================
// UPDATE PAYMENT
// ===============================
exports.updatePayment = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      project_id,
      amount,
      payment_date,
      payment_method,
      notes
    } = req.body;


    const result = await pool.query(
      `UPDATE payments
       SET
         project_id = $1,
         amount = $2,
         payment_date = $3,
         payment_method = $4,
         notes = $5
       WHERE id = $6
       RETURNING *`,
      [
        project_id,
        amount,
        payment_date,
        payment_method,
        notes,
        id
      ]
    );


    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        error: "Payment not found"
      });

    }


    res.json({
      success: true,
      payment: result.rows[0]
    });

  } catch (err) {

    console.error("UPDATE PAYMENT ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



// ===============================
// DELETE PAYMENT
// ===============================
exports.deletePayment = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM payments
       WHERE id = $1
       RETURNING id`,
      [id]
    );


    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        error: "Payment not found"
      });

    }


    res.json({
      success: true,
      message: "Payment deleted"
    });

  } catch (err) {

    console.error("DELETE PAYMENT ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



// ===============================
// GET MONTHLY REVENUE
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

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



// ===============================
// GET TOP CLIENTS
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

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



// ===============================
// GET REVENUE BY DATE RANGE
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
      [
        req.user.id,
        start_date,
        end_date
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};