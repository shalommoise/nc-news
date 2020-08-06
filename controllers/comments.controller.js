const {
  makeComment,
  getCommentsById,
  updateCommentByVote,
  removeComment,
  sendAllComments,
} = require("../models/comments.model");

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

exports.patchCommentByVote = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateCommentByVote(comment_id, inc_votes).then((comment) => {
    res.send({ comment });
  });
};

exports.deleteComment = (req, res) => {
  const { comment_id } = req.params;

  removeComment(comment_id).then(() => {
    res.sendStatus(204);
  });
};

exports.getAllComments = (req, res) => {
  sendAllComments().then((comments) => {
    res.send({ comments });
  });
};
