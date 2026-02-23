const pool = require("../db/connection");


// ===============================
// CREATE CLIENT
// ===============================
exports.createClient = async (req, res) => {
  try {

    const { name, email, phone, company } = req.body;

    const result = await pool.query(
      `INSERT INTO clients 
       (user_id, name, email, phone, company)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        req.user.id,
        name,
        email,
        phone,
        company
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    console.error("CREATE CLIENT ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



// ===============================
// GET ALL CLIENTS
// ===============================
exports.getClients = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT *
       FROM clients
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {

    console.error("GET CLIENTS ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



// ===============================
// UPDATE CLIENT
// ===============================
exports.updateClient = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      email,
      phone,
      company
    } = req.body;

    const result = await pool.query(
      `UPDATE clients
       SET
         name = $1,
         email = $2,
         phone = $3,
         company = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [
        name,
        email,
        phone,
        company,
        id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        error: "Client not found"
      });

    }

    res.json({
      success: true,
      client: result.rows[0]
    });

  } catch (err) {

    console.error("UPDATE CLIENT ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



// ===============================
// DELETE CLIENT
// ===============================
exports.deleteClient = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM clients
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        error: "Client not found"
      });

    }

    res.json({
      success: true,
      message: "Client deleted"
    });

  } catch (err) {

    console.error("DELETE CLIENT ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};