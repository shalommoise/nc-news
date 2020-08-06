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
      console.log(res);
      return res;
    });
};
