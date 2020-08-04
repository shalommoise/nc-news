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
