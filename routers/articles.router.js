const articlesRouter = require("express").Router();
const { methodsErrorHandler } = require("../errors");
const {
  sendAllArticles,
  sendArticleById,
  updateArticleVote,
} = require("../controllers/articles.controller");

const {
  postComment,
  sendCommentsByArticleId,
} = require("../controllers/comments.controller");

articlesRouter.get("/", sendAllArticles);

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(updateArticleVote);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(sendCommentsByArticleId);

articlesRouter.all(methodsErrorHandler);
module.exports = articlesRouter;
