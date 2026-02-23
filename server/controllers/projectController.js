const pool = require("../db/connection");


// ===============================
// CREATE PROJECT
// ===============================
exports.createProject = async (req, res) => {
  try {

    const {
      client_id,
      project_name,
      description,
      price,
      status,
      deadline
    } = req.body;

    const result = await pool.query(
      `INSERT INTO projects 
       (user_id, client_id, project_name, description, price, status, deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user.id,
        client_id,
        project_name,
        description,
        price,
        status,
        deadline
      ]
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
         p.client_id,
         p.project_name,
         p.description,
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
// UPDATE PROJECT
// ===============================
exports.updateProject = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      client_id,
      project_name,
      description,
      price,
      status,
      deadline
    } = req.body;

    const result = await pool.query(
      `UPDATE projects
       SET
         client_id = $1,
         project_name = $2,
         description = $3,
         price = $4,
         status = $5,
         deadline = $6
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [
        client_id,
        project_name,
        description,
        price,
        status,
        deadline,
        id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ===============================
// DELETE PROJECT
// ===============================
exports.deleteProject = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM projects
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ success: true });

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