const articlesRouter = require("express").Router();

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

articlesRouter.all("*", (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
});
module.exports = articlesRouter;
