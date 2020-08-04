const usersRouter = require("express").Router();
const {
  sendUsers,
  sendUsersByUsername,
  sendUsersByAvatar,
} = require("../controllers/users.controller");
usersRouter.get("/", sendUsers);
usersRouter.get("/:username", sendUsersByUsername);
//usersRouter.get("/:avatar_url", sendUsersByAvatar);

module.exports = usersRouter;
