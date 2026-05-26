const { Pool } = require("pg");
const { supabaseDbUrl } = require("../config/env");

const pool = new Pool({
  connectionString: supabaseDbUrl,
  ssl: { rejectUnauthorized: false }
});

module.exports = { pool };
