const fs = require("fs");
const pg = require("pg");
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(process.env.DB_SSL_CA_PATH).toString(),
  },
};

const client = new pg.Client(config);

module.exports = { client };
