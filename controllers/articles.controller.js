const {
  getAllArticles,
  getArticleById,
  patchArticleVote,
} = require("../models/articles.model");

exports.sendAllArticles = (req, res, next) => {
  getAllArticles(req.query)
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
    .catch(next);
};

exports.updateArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;

  patchArticleVote(article_id, newVote)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};

exports.methodNotAllowed = (req, res, next) => {
  return Promise.reject({ status: 405, msg: "method not allowed" }).catch(next);
};
