const connection = require("../db/connection");
const { returning } = require("../db/connection");

exports.getAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
}) => {
  return connection
    .select("articles.*")
    .from("articles")
    .join("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.comment_id", { as: "comment_count" })
    .orderBy(sort_by, order)
    .modify((query) => {
      if (author) query.where("articles.author", author);
      else if (topic) query.where("articles.topic", topic);
    })
    .then((res) => {
      if (res.length === 0)
        return Promise.reject({ status: 404, msg: "No articles found" });
      else
        return res.map((article) => {
          article.comment_count = Number(article.comment_count);
          return article;
        });
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
  if (typeof newVote.inc_votes !== "number") newVote.inc_votes = 0;
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", newVote.inc_votes)
    .returning("*")
    .then((res) => {
      return res;
    });
};
