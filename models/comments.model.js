const {pool} = require("../db/connection");
const {removeApostraphe, addApostraphe} = require("../db/utils/utils")
exports.makeComment = (article_id, comment) => {
 
  const {username, body} = comment;
  return pool.connect()
  .then(()=>pool.query((`INSERT INTO comments(article_id, author, body) VALUES(${article_id}, '${username}', '${removeApostraphe(body)}') RETURNING *;`))).then((res)=>{
    const [comment] = res.rows
   if (comment.author === null) return Promise.reject({ status: 400, msg: "bad request" })
   comment.body  = addApostraphe(comment.body)
    return comment;
  })
};

exports.getCommentsByArticleId = (
  article_id,
  sort_by = "comments.created_at",
  order = "asc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where("comments.article_id", article_id)
    .orderBy(sort_by, order)
    .then((res) => {
      if (res.length === 0) {
        return connection
          .select("article_id")
          .from("articles")
          .where("article_id", article_id)
          .then((res) => {
            if (res.length === 0)
              return Promise.reject({ status: 404, msg: "article not found" });
            else return [];
          });
      }
      return res;
    });
};

exports.updateCommentByVote = (comment_id, inc_votes = 0) => {
 return pool.connect()
  .then(()=>pool.query(`UPDATE comments SET votes = votes + ${inc_votes} WHERE comment_id = '${comment_id}' RETURNING *;`))
 .then((res) => {
const [comment] = res.rows;
if(!comment) return Promise.reject({ status: 404, msg: "comment not found" });
return comment;
  });
};

exports.removeComment = (comment_id) => {
   return pool.connect()
  .then(()=>pool.query(`DELETE FROM comments WHERE comment_id = '${comment_id}';`))
  .then((res)=>res.rows)
};

exports.sendAllComments = () => {
  return pool.connect()
  .then(()=>pool.query("SELECT * FROM comments;"))
  .then((res)=>res.rows)
}
