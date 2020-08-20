const app = require("../app");

const commentsRouter = require("express").Router();
const {
  patchCommentByVote,
  deleteComment,
  getAllComments,
} = require("../controllers/comments.controller");
commentsRouter
  .route("/:comment_id")
  .patch(patchCommentByVote)
  .delete(deleteComment);

commentsRouter.get("/", getAllComments);

commentsRouter.all("*", (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
});

module.exports = commentsRouter;
