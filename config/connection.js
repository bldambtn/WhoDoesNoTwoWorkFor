require("dotenv").config(); // Ensure this is at the top
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432, // Default PostgreSQL port
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Database connection successful!");
    release();
  }
});

module.exports = pool;