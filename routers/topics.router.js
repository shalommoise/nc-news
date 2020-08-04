const topicsRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics.controller");

topicsRouter.get("/", sendTopics);

module.exports = topicsRouter;
