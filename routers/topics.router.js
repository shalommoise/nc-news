const topicsRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics.controller");
const { methodsErrorHandler } = require("../errors");
topicsRouter.get("/", sendTopics);

topicsRouter.all(methodsErrorHandler);
module.exports = topicsRouter;
