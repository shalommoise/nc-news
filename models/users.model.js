const connection = require("../db/connection");

exports.getUsers = () => {
  return connection
    .select("*")
    .from("users")
    .then((results) => {
      return results;
    });
};

exports.getUsersByUsername = (username) => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then((results) => {
      return results;
    });
};

exports.getUsersByAvatar = (avatar_url) => {
  return connection
    .select("*")
    .from("users")
    .where("avatar_url", avatar_url)
    .then((results) => {
      return results;
    });
};
