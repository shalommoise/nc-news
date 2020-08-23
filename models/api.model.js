const { getUsers } = require("./users.model");
const connection = require("../db/connection");
exports.sendInfo = () => {
  return connection
    .select("*")
    .from("topics")
    .then(() => {
      return {
        topics: { GET: "/" },
        users: { GET: ["/", "/:username"] },
        articles: [
          { GET: ["/", "/:article_id", "/:article_id/comments"] },
          { PATCH: "/:article_id" },
          { POST: "/:article_id/comments" },
        ],
        comments: { GET: "/", PATCH: "/:comment_id", DELETE: "/:comment_id" },
      };
    });
};
