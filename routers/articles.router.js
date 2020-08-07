const articlesRouter = require("express").Router();
const {
  sendAllArticles,
  sendArticleById,
  updateArticleVote,
  methodNotAllowed,
} = require("../controllers/articles.controller");

const {
  postComment,
  sendCommentsByArticleId,
} = require("../controllers/comments.controller");

articlesRouter.get("/", sendAllArticles);

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(updateArticleVote)
  .delete(methodNotAllowed)
  .put(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(sendCommentsByArticleId);

module.exports = articlesRouter;
