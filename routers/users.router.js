const usersRouter = require("express").Router();
const {
  sendUsers,
  sendUsersByUsername,
} = require("../controllers/users.controller");
usersRouter.get("/", sendUsers);
usersRouter.get("/:username", sendUsersByUsername);

module.exports = usersRouter;
