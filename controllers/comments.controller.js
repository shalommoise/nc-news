const { makeComment, getCommentsById } = require("../models/comments.model");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  makeComment(article_id, comment).then((comment) => {
    res.status(201).send({ comment });
  });
};

exports.sendCommentsById = (req, res) => {
  const { article_id } = req.params;

  getCommentsById(article_id).then((comments) => {
    res.send({ comments });
  });
};
