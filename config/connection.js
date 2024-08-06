// Loading environment variables from a .env file using dotenv
require("dotenv").config();

// Importing the Pool class from the pg package
const { Pool } = require("pg");

// Creating a new Pool instance with database connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Connecting to the database and handling connection errors
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Database connection successful!");
    release();
  }
});

// Exporting the pool for use in other modules
module.exports = pool;