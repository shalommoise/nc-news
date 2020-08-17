const app = require("../app");
const { methodsErrorHandler } = require("../errors");
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

commentsRouter.all(methodsErrorHandler);

module.exports = commentsRouter;
