const {pool} = require("../db/connection");
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
exports.getAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
}) => {
  return pool.connect()
  .then(
    ()=> pool.query("SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = comments.article_id GROUP BY articles.article_id;").then((res) => {

      // .groupBy("articles.article_id")
//     .count("comments.comment_id", { as: "comment_count" })
   return res.rows
}).catch((err)=>console.log(err)))
};
//  JOIN comments ON 'articles.article_id'='comments.article_id'

exports.getArticleById = (article_id) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.comment_id", { as: "comment_count" })
    .where("articles.article_id", article_id)
    .then((res) => {
      if (res.length === 0)
        return Promise.reject({ status: 404, msg: "article not found" });
      res[0].comment_count = Number(res[0].comment_count);
      return res[0];
    });
};

exports.patchArticleVote = (article_id, inc_votes = 0) => {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((res) => {
      if (typeof inc_votes !== "number") {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
      return res[0];
    });
};

exports.createArticle = ({title, body, topic, author} )=>{
  const checkUser = getUsersByUsername(author);
return  Promise.all([checkUser]).then(()=>{
  return connection
  .insert({title, body, author, topic})
  .into("articles")
  .returning("*")
  .then((res)=>{
   return res[0]
 })
  });

}