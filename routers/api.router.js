const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");

const { getInfo } = require("../controllers/api.controller");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.get("/", getInfo);
apiRouter.all("/", (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
});
module.exports = apiRouter;
