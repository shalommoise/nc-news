const articlesRouter = require("express").Router();
const {
  sendAllArticles,
  sendArticleById,
  updateArticleVote,
} = require("../controllers/articles.controller");
const {
  postComment,
  sendCommentsById,
} = require("../controllers/comments.controller");

articlesRouter.get("/", sendAllArticles);

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(updateArticleVote);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(sendCommentsById);

module.exports = articlesRouter;
