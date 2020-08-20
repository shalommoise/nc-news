const topicsRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics.controller");

topicsRouter.get("/", sendTopics);

topicsRouter.all("*", (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
});
module.exports = topicsRouter;
