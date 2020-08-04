const { getAllArticles, getArticleById } = require("../models/articles.model");

exports.sendAllArticles = (req, res) => {
  getAllArticles().then((articles) => {
    res.send({ articles });
  });
};

exports.sendArticleById = (req, res) => {
  const { article_id } = req.params;
  getArticleById(article_id).then((article) => {
    res.send({ article });
  });
};
