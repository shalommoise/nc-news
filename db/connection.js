
const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}


const config = {
   user: "shalom",
  password: "pass",
  host: "localhost",
  port: 5432,
  database: "nc_news",
 connectionString:  ENV === 'production' ? process.env.DATABASE_URL : '',
        ssl: ENV === 'production' ?  {
          rejectUnauthorized: false,
        } : {},
}

const {Pool, Client} = require('pg');
const pool = new Pool(config);
const client = new Client(config);
module.exports = {pool, client};
