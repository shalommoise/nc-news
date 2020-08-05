const {
  getAllArticles,
  getArticleById,
  patchArticleVote,
} = require("../models/articles.model");

exports.sendAllArticles = (req, res) => {
  getAllArticles().then((articles) => {
    res.send({ articles });
  });
};

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  getArticleById(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleVote = (req, res) => {
  const { article_id } = req.params;
  const newVote = req.body;

  patchArticleVote(article_id, newVote).then((article) => {
    res.send({ article });
  });
};
