const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function () {
  // add seeding functionality here
  // this function should take as argument(s) all the data it needs to seed
  // it should insert this data into the relevant tables in your database
  client.connect()
.then(()=>console.log("connected successfully"))
.then(()=>client.query('CREATE TABLE topics (slug VARCHAR , description VARCHAR, PRIMARY KEY (slug));'))
.then(()=>client.query("CREATE TABLE users (username VARCHAR NOT NULL, avatar_url VARCHAR DEFAULT 'Picture not available', name VARCHAR NOT NULL, PRIMARY KEY (username));"))
.then(()=>client.query('CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR NOT NULL, body VARCHAR NOT NULL, votes INT DEFAULT 0, comment_count INT DEFAULT 0, topic VARCHAR, author VARCHAR NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(topic) REFERENCES topics(slug), FOREIGN KEY(author) REFERENCES users(username));'))
.then(()=>client.query('CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, author VARCHAR NOT NULL, article_id INT NOT NULL, votes INT DEFAULT 0,body VARCHAR NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(author) REFERENCES users(username), FOREIGN KEY(article_id) REFERENCES articles(article_id));'))
.catch((e)=>console.log("err: ", e))
};
exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData).returning("*");
      const usersInsertions = knex("users").insert(userData).returning("*");

      return Promise.all([topicsInsertions, usersInsertions]).then(() => {
        const formattedArticlesTimes = formatDates(articleData);
        return knex("articles").insert(formattedArticlesTimes).returning("*");
      });
    })
    .then((articleRows) => {
      const articleRef = makeRefObj(articleRows);
      const newDates = formatDates(commentData);

      const formattedComments = formatComments(newDates, articleRef);

      return knex("comments").insert(formattedComments);
    });
};
