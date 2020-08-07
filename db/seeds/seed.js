const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

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
