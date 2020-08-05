const connection = require("../db/connection");
const { returning } = require("../db/connection");

exports.getAllArticles = () => {
  return connection
    .select("*")
    .from("articles")
    .then((res) => {
      return res;
    });
};

exports.getArticleById = (article_id) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.comment_id", { as: "comment_count" })
    .where("articles.article_id", article_id)
    .then((res) => {
      if (res.length === 0)
        return Promise.reject({ status: 404, msg: "article not found" });
      res[0].comment_count = Number(res[0].comment_count);

      return res;
    });
};

exports.patchArticleVote = (article_id, newVote) => {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", newVote.inc_votes)
    .returning("*")
    .then((res) => {
      return res;
    });
};
