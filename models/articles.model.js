const {pool} = require("../db/connection");
const {commentCountConverter} = require("../db/utils/pqslUtils")
// const { returning } = require("../db/connection");
const {getUsersByUsername}= require("./users.model")
// exports.getAllArticles = ({
//   sort_by = "created_at",
//   order = "desc",
//   author,
//   topic,
// }) => {
//   return connection
//     .select("articles.*")
//     .from("articles")
//     .join("comments", "articles.article_id", "comments.article_id")
//     .groupBy("articles.article_id")
//     .count("comments.comment_id", { as: "comment_count" })
//     .orderBy(sort_by, order)
//     .modify((query) => {
//       if (author) query.where("articles.author", author);
//       else if (topic) query.where("articles.topic", topic);
//     })
//     .then((res) => {
//       return res.map((article) => {
//         article.comment_count = Number(article.comment_count);
//         return article;
//       });
//     });
// };

exports.getAllArticles = (query) => {
  commentCountConverter();
  const  {sort_by = "created_at",  order = "desc", author, topic} = query;
  let filter = '';
  
  if(author) filter = `WHERE author = '${author}'`;
  if(topic) filter = `WHERE topic = '${topic}'`
  if(topic && author) filter = `WHERE author = '${author}' AND topic = '${topic}'`;
  return pool.connect()
  .then(()=> pool.query(`SELECT * FROM articles ${filter} ORDER BY ${sort_by} ${order};`).then((res)=>{
    console.log(filter, res.rows)
  return res.rows;
})
.catch((err)=>console.log(err)))
};


// exports.getArticleById = (article_id) => {
//   return connection
//     .select("articles.*")
//     .from("articles")
//     .leftJoin("comments", "articles.article_id", "comments.article_id")
//     .groupBy("articles.article_id")
//     .count("comments.comment_id", { as: "comment_count" })
//     .where("articles.article_id", article_id)
//     .then((res) => {
//       if (res.length === 0)
//         return Promise.reject({ status: 404, msg: "article not found" });
//       res[0].comment_count = Number(res[0].comment_count);
//       return res[0];
//     });
// };
exports.getArticleById = (article_id) => {
   commentCountConverter();
return pool.connect().then(()=>pool.query(`SELECT * FROM articles WHERE article_id = ${article_id};`)).then((res)=>{
   const [article] = res.rows; 
    if(!res.rows.length) return Promise.reject({ status: 404, msg: "article not found" });
      return article;
})
};
//, COUNT(articles.article_id) AS comment_count
//JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = comments.article_id GROUP BY articles.article_id;
exports.patchArticleVote = (article_id, inc_votes = 0) => {
  return pool.connect()
  .then(()=>pool.query(`UPDATE articles SET votes = votes + 1 WHERE article_id = '${article_id}' RETURNING *;`)).then((res)=>{
   const [article] = res.rows; 
      return article;
  })
  // return connection("articles")
  //   .where("article_id", article_id)
  //   .increment("votes", inc_votes)
  //   .returning("*")
  //   .then((res) => {
  //     if (typeof inc_votes !== "number") {
  //       return Promise.reject({ status: 400, msg: "Bad Request" });
  //     }
  //     return res[0];
  //   });
};

exports.createArticle = ({title, body, topic, author} )=>{
 
  const checkUser = getUsersByUsername(author);
  return  Promise.all([checkUser]).then(()=>{
    return pool.connect()
    .then(()=>pool.query(`INSERT INTO articles(title, body, topic, author) VALUES('${title}', '${body}', '${topic}', '${author}') RETURNING *;`))
    .then((res)=>{
     const [article] = res.rows; 
      return article;
    }).catch((err)=>console.log(err))
  })
// return  Promise.all([checkUser]).then(()=>{
//   return connection
//   .insert({title, body, author, topic})
//   .into("articles")
//   .returning("*")
//   .then((res)=>{
//    return res[0]
//  })
  // });

}