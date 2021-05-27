const topicsRouter = require("express").Router();
const { sendTopics, sendSingleTopic } = require("../controllers/topics.controller");

topicsRouter.get("/", sendTopics);

topicsRouter.route("/:slug").get(sendSingleTopic)

topicsRouter.all("/", (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
});
module.exports = topicsRouter;
