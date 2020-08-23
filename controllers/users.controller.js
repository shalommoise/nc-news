const { getUsers, getUsersByUsername } = require("../models/users.model");

exports.sendUsers = (req, res, next) => {
  getUsers()
    .then((users) => res.send({ users }))
    .catch(next);
};

exports.sendUsersByUsername = (req, res, next) => {
  const { username } = req.params;

  getUsersByUsername(username)
    .then((user) => {
      res.send({ user: { user } });
    })
    .catch(next);
};
