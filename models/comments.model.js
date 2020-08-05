const connection = require("../db/connection");
const { from } = require("../db/connection");

exports.makeComment = (article_id, comment) => {
  return connection
    .insert({
      author: comment.username,
      article_id: article_id,
      body: comment.body,
    })
    .into("comments")
    .returning("*")
    .then((res) => {
      return res;
    });
};

exports.getCommentsById = (article_id) => {
  return connection
    .select("*")
    .from("comments")
    .join("articles", "articles.article_id", "comments.article_id")
    .where("comments.article_id", article_id)
    .then((res) => {
      return res;
    });
};
