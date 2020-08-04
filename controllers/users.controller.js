const { getUsers, getUsersByUsername } = require("../models/users.model");

exports.sendUsers = (req, res, next) => {
  getUsers()
    .then((users) => res.send({ users }))
    .catch((err) => {
      next(err);
    });
};

exports.sendUsersByUsername = (req, res, next) => {
  const { username } = req.params;

  getUsersByUsername(username)
    .then((users) => res.send({ users }))
    .catch((err) => {
      next(err);
    });
};