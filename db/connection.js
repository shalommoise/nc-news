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

console.log("trying to connect");

// client.connect()
// .then(()=>console.log("connected successfully"))
// .then(()=>client.query('CREATE TABLE topics (slug VARCHAR , description VARCHAR, PRIMARY KEY (slug));'))
// .then(()=>client.query("CREATE TABLE users (username VARCHAR NOT NULL, avatar_url VARCHAR DEFAULT 'Picture not available', name VARCHAR NOT NULL, PRIMARY KEY (username));"))
// .then(()=>client.query('CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR NOT NULL, body VARCHAR NOT NULL, votes INT DEFAULT 0, comment_count INT DEFAULT 0, topic VARCHAR, author VARCHAR NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(topic) REFERENCES topics(slug), FOREIGN KEY(author) REFERENCES users(username));'))
// .then(()=>client.query('CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, author VARCHAR NOT NULL, article_id INT NOT NULL, votes INT DEFAULT 0,body VARCHAR NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(author) REFERENCES users(username), FOREIGN KEY(article_id) REFERENCES articles(article_id));'))
// .catch((e)=>console.log("err: ", e))


module.exports = client;
//there is no unique constraint matching given keys for referenced table "users"