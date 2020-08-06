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

module.exports = commentsRouter;
