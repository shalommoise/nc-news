const {pool} = require("../db/connection");
const {commentCountConverter} = require("../db/utils/pqslUtils")
const {getUsersByUsername}= require("./users.model")
const {removeApostraphe, formatMultipleApostarpheArticle} = require("../db/utils/utils")

exports.getAllArticles = (query) => {
  commentCountConverter();
  const  {sort_by = "created_at",  order = "desc", author, topic} = query;
  let filter = '';
  
  if(author) filter = `WHERE author = '${removeApostraphe(author)}'`;
  if(topic) filter = `WHERE topic = '${removeApostraphe(topic)}'`;
  if(topic && author) filter = `WHERE author = '${removeApostraphe(author)}' AND topic = '${removeApostraphe(topic)}'`;
 return pool.query(`SELECT * FROM articles ${filter} ORDER BY ${sort_by} ${order};`).then((res)=>{
    const articles = res.rows.map((article)=> formatMultipleApostarpheArticle(article))
  return articles;
})

};


exports.getArticleById = (article_id) => {
   commentCountConverter();

return pool.query(`SELECT * FROM articles WHERE article_id = ${article_id};`)

.then((res)=>{
   const [article] = res.rows; 
    if(!res.rows.length) return Promise.reject({ status: 404, msg: "article not found" });
     return formatMultipleApostarpheArticle(article);
})
};

exports.patchArticleVote = (article_id, inc_votes = 0) => {

  console.log(inc_votes)
  return pool.query(`UPDATE articles SET votes = votes + ${inc_votes} WHERE article_id = '${article_id}' RETURNING *;`)

  .then((res)=>{
   const [article] = res.rows; 
      return article;
  })
};

exports.createArticle = ({title, body, topic, author} )=>{
 
  const checkUser = getUsersByUsername(author);
  return  Promise.all([checkUser]).then(()=>{
  
    return pool.query(`INSERT INTO articles(title, body, topic, author) VALUES('${removeApostraphe(title)}', '${removeApostraphe(body)}', '${topic}', '${removeApostraphe(author)}') RETURNING *;`)

    .then((res)=>{
     const [article] = res.rows;
      return formatMultipleApostarpheArticle(article);
    })
  })


}