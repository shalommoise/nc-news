const usersRouter = require("express").Router();
const {
  sendUsers,
  sendUsersByUsername,
} = require("../controllers/users.controller");
const { methodsErrorHandler } = require("../errors");
usersRouter.get("/", sendUsers);
usersRouter.get("/:username", sendUsersByUsername);
usersRouter.all(methodsErrorHandler);
module.exports = usersRouter;
