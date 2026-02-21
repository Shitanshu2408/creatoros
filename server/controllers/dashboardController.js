const pool = require("../db/connection");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Revenue
    const totalRevenue = await pool.query(
      `SELECT COALESCE(SUM(pay.amount),0) AS total_revenue
       FROM payments pay
       JOIN projects p ON pay.project_id = p.id
       WHERE p.user_id = $1`,
      [userId]
    );

    // Total Projects
    const totalProjects = await pool.query(
      `SELECT COUNT(*) AS total_projects
       FROM projects
       WHERE user_id = $1`,
      [userId]
    );

    // Total Clients
    const totalClients = await pool.query(
      `SELECT COUNT(*) AS total_clients
       FROM clients
       WHERE user_id = $1`,
      [userId]
    );

    // Pending Amount
    const pendingAmount = await pool.query(
      `SELECT 
         COALESCE(SUM(p.price - COALESCE(pay.total_paid,0)),0) AS total_pending
       FROM projects p
       LEFT JOIN (
         SELECT project_id, SUM(amount) AS total_paid
         FROM payments
         GROUP BY project_id
       ) pay ON p.id = pay.project_id
       WHERE p.user_id = $1`,
      [userId]
    );

    res.json({
      total_revenue: totalRevenue.rows[0].total_revenue,
      total_projects: totalProjects.rows[0].total_projects,
      total_clients: totalClients.rows[0].total_clients,
      total_pending: pendingAmount.rows[0].total_pending
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};