const {pool} = require("../db/connection");
const {removeApostraphe, addApostraphe} = require("../db/utils/utils");

exports.makeComment = (article_id, comment) => {
  
  const {username = '', body = ''} = comment;
  if(!username) return Promise.reject({status: 400, msg: "bad request"})
  return pool.connect()
  .then(()=>pool.query((`INSERT INTO comments(article_id, author, body) VALUES(${article_id}, '${username}', '${removeApostraphe(body)}') RETURNING *;`))).then((res)=>{
    const [comment] = res.rows;
   if (comment.author === null) return Promise.reject({ status: 400, msg: "bad request" })
   comment.body  = addApostraphe(comment.body)
    return comment;
  })
};

exports.getCommentsByArticleId = (article_id, query) => {
  const {sort_by = "created_at",  order = "desc"} = query;
   return pool.connect()
   .then(()=>pool.query(`SELECT * FROM comments WHERE article_id = ${article_id} ORDER BY ${sort_by} ${order};`)).then((res)=>{
const comments = res.rows.map((comment)=> {
  comment.body = addApostraphe(comment.body);
  return comment;
})
if(!comments.length) return Promise.reject({ status: 404, msg: "article not found" });
    return comments;
   })
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
