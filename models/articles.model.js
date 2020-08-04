const connection = require("../db/connection");

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
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then((res) => {
      return res;
    });
};
