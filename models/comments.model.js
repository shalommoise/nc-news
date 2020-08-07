const connection = require("../db/connection");

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

exports.getCommentsByArticleId = (
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
      if (res.length === 0) {
        return connection
          .select("article_id")
          .from("articles")
          .where("article_id", article_id)
          .then((res) => {
            if (res.length === 0) {
              return Promise.reject({
                status: 404,
                msg: "article not found",
              });
            } else
              return Promise.reject({
                status: 200,
                msg: "article has no comments",
              });
          });
      }

      return res;
    });
};

exports.updateCommentByVote = (comment_id, inc_votes) => {
  if (typeof inc_votes !== "number") inc_votes = 0;
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
      if (res === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else return res;
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