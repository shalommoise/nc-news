
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const test = 'nc_news_test';
const dev = 'nc_news';
 

const config = {
   user: "shalom",
  password: "pass",
  host: "localhost",
  port: 5432,
  database: dev,
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false,
      }
  }
};

const {Pool, Client} = require('pg');
const pool = new Pool(config);
const client = new Client(config)
module.exports = {pool, client};
