
const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}
const productConfig = 
  ENV === 'production' ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

const config = {
  //  user: "shalom",
  // password: "pass",
  // host: "localhost",
  // port: 5432,
  // database: "nc_news",
  productConfig
}

const {Pool, Client} = require('pg');
const pool = new Pool(config);
const client = new Client(config);
module.exports = {pool, client};
