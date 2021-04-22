const client = require("../connection.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function (topicData, articleData, commentData, userData) {
   client.connect()
.then(()=>console.log("connected successfully"))
.then(()=> client.query('DROP TABLE IF EXISTS topics, users, articles, comments;'))
.then(()=>client.query('CREATE TABLE topics (slug VARCHAR , description VARCHAR, PRIMARY KEY (slug));'))
.then(()=>client.query("CREATE TABLE users (username VARCHAR NOT NULL, avatar_url VARCHAR DEFAULT 'Picture not available', name VARCHAR NOT NULL, PRIMARY KEY (username));"))
.then(()=>client.query('CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR NOT NULL, body VARCHAR NOT NULL, votes INT DEFAULT 0, comment_count INT DEFAULT 0, topic VARCHAR, author VARCHAR NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(topic) REFERENCES topics(slug), FOREIGN KEY(author) REFERENCES users(username));'))
.then(()=>client.query('CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, author VARCHAR NOT NULL, article_id INT NOT NULL, votes INT DEFAULT 0,body VARCHAR NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(author) REFERENCES users(username), FOREIGN KEY(article_id) REFERENCES articles(article_id));'))
.then(()=> {
    const slugs = topicData.map((datum)=> datum.slug);
    const descriptions = topicData.map((datum)=> datum.description); 
    const insertTopics = (n) => client.query(`INSERT INTO topics (slug, description) VALUES ('${slugs[n]}' , '${descriptions[n]}');`)
    .then(()=>n < slugs.length - 1 && insertTopics(n + 1))
      // return insertTopics(0);
   const usernames = userData.map((datum)=> datum.username);
   const names = userData.map((datum)=> datum.name);
   const avatar_urls = userData.map((datum)=> datum.avatar_url);
     const insertUsers = (n) => client.query(`INSERT INTO users (username, name, avatar_url) VALUES ('${usernames[n]}' , '${names[n]}', '${avatar_urls[n]}');`)
     .then(()=>n < slugs.length - 1 && insertUsers(n + 1))
      return Promise.all([insertTopics(0), insertUsers(0)]).then(() => {
        console.log("done")
      //   const formattedArticlesTimes = formatDates(articleData);
      //   return client.query(`INSERT INTO articles ${formattedArticlesTimes}`);
      // });
 })
// .then((articleRows) => {
//       const articleRef = makeRefObj(articleRows);
//       const newDates = formatDates(commentData);
//       const formattedComments = formatComments(newDates, articleRef);
//       return client.query(`INSERT INTO comments ${formattedComments}`);
})
.catch((e)=>console.log("err: ", e))
.finally(()=> client.end())
};

 // add seeding functionality here
  // this function should take as argument(s) all the data it needs to seed
  // it should insert this data into the relevant tables in your database

// exports.seed = function (knex) {
//   return knex.migrate
//     .rollback()
//     .then(() => knex.migrate.latest())
//     .then(() => {
//       const topicsInsertions = knex("topics").insert(topicData).returning("*");
//       const usersInsertions = knex("users").insert(userData).returning("*");

//       return Promise.all([topicsInsertions, usersInsertions]).then(() => {
//         const formattedArticlesTimes = formatDates(articleData);
//         return knex("articles").insert(formattedArticlesTimes).returning("*");
//       });
//     })
//     .then((articleRows) => {
//       const articleRef = makeRefObj(articleRows);
//       const newDates = formatDates(commentData);

//       const formattedComments = formatComments(newDates, articleRef);

//       return knex("comments").insert(formattedComments);
//     });
// };
