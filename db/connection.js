/*const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");
const config = require("../knexfile");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("../knexfile");

module.exports = knex(dbConfig);*/

// make a connection to your database here
// and export it so that you can use it to interact with your database
const test = 'nc_news_test';
const dev = 'nc_news';
const config = {
   user: "shalom",
  password: "pass",
  host: "localhost",
  port: 5432,
  database: test
};

const {Client} = require('pg');
const client = new Client(config);

module.exports = client;
