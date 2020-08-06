const {
  getAllArticles,
  getArticleById,
  patchArticleVote,
} = require("../models/articles.model");

exports.sendAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  getAllArticles(sort_by, order, author, topic)
    .then((articles) => {
      res.send({ articles });
    })
    .catch(next);
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
