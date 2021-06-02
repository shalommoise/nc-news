
exports.getInfo = (req, res, next) => {

      res.send({ "nc-news": {api: {
        topics: { GET: "/" },
        users: { GET: ["/", "/:username"] },
        articles: [
          { GET: ["/", "/:article_id", "/:article_id/comments"] },
          { PATCH: "/:article_id" },
          { POST: "/:article_id/comments" },
        ],
        comments: { GET: "/", 
        PATCH: "/:comment_id", 
        DELETE: "/:comment_id" },
      } 
    }
  })
};
