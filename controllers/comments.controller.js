const { makeComment, getCommentsById } = require("../models/comments.model");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  makeComment(article_id, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.sendCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  const { order } = req.query;

  getCommentsById(article_id, sort_by, order).then((comments) => {
    res.send({ comments });
  });
};
