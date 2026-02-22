const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT), // important fix
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection on startup
pool.connect()
  .then(() => {
    console.log("✅ Supabase database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Supabase connection error:", err.message);
  });

module.exports = pool;