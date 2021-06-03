
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
  // host: "ec2-54-224-124-241.compute-1.amazonaws.com",
  // port: 5432,
  // database: "nc_news",


    user: "sbulormryqiaad",
  password: "f2defd5bbcc352eeb8607a6898aac6d405e8fff69c9bac0d0655663ebb33d7df",
  host: "ec2-54-224-124-241.compute-1.amazonaws.com",
  port: 5432,
  database: "dcoh7qlfpp16k1",
  productConfig
}

const {Pool, Client} = require('pg');
const pool = new Pool(config);
const client = new Client(config);
module.exports = {pool, client};
