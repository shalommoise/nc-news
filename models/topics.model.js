const connection = require("../db/connection");

exports.getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then((res) => {
      return res;
    });
};
