const usersRouter = require("express").Router();
const {
  sendUsers,
  sendUsersByUsername,
} = require("../controllers/users.controller");

usersRouter.get("/", sendUsers);
usersRouter.get("/:username", sendUsersByUsername);
usersRouter.all("*", (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
});
module.exports = usersRouter;
