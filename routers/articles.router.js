const articlesRouter = require("express").Router();

const {
  sendAllArticles,
  sendArticleById,
  updateArticleVote,
  postArticle
} = require("../controllers/articles.controller");

const {
  postComment,
  sendCommentsByArticleId,
} = require("../controllers/comments.controller");

articlesRouter.route("/").get(sendAllArticles).post(postArticle);

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
