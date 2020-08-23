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
      if (results.length === 0)
        return Promise.reject({ status: 404, msg: "User not found" });
      return results[0];
    });
};
