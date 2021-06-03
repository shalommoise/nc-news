
const { DB_URL } = process.env;

const config = {
   user: "shalom",
  password: "pass",
  host: "localhost",
  port: 5432,
  database: "nc_news",
  connection: process.env.DATABASE_URL,
  connectionString: DB_URL,
  ssl: {
        rejectUnauthorized: false,
       }
};

const {Pool, Client} = require('pg');
const pool = new Pool(config);
const client = new Client(config);
module.exports = {pool, client};
