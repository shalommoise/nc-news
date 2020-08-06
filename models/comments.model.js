const connection = require("../db/connection");
const { from, andHaving } = require("../db/connection");

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
      if (res[0].author === null)
        return Promise.reject({ status: 406, msg: "missing user information" });
      return res;
    });
};

exports.getCommentsById = (
  article_id,
  sort_by = "comments.created_at",
  order = "asc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where("comments.article_id", article_id)
    .orderBy(sort_by, order)
    .then((res) => {
      return res;
    });
};

exports.updateCommentByVote = (comment_id, inc_votes) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((res) => {
      return res;
    });
};

exports.removeComment = (comment_id) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then((res) => {
      return res;
    });
};

exports.sendAllComments = () => {
  return connection
    .select("*")
    .from("comments")
    .then((res) => {
      return res;
    });
};
