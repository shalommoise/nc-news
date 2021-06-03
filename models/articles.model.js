const {pool} = require("../db/connection");
const {commentCountConverter} = require("../db/utils/pqslUtils")
const {getUsersByUsername}= require("./users.model")
const {removeApostraphe, addApostraphe} = require("../db/utils/utils")

exports.getAllArticles = (query) => {
  commentCountConverter();
  const  {sort_by = "created_at",  order = "desc", author, topic} = query;
  let filter = '';
  
  if(author) filter = `WHERE author = '${author}'`;
  if(topic) filter = `WHERE topic = '${topic}'`
  if(topic && author) filter = `WHERE author = '${author}' AND topic = '${topic}'`;
  return pool.connect()
  .then(()=> pool.query(`SELECT * FROM articles ${filter} ORDER BY ${sort_by} ${order};`).then((res)=>{
  return res.rows;
})
.catch((err)=>console.log(err)))
};


exports.getArticleById = (article_id) => {
   commentCountConverter();
return pool.connect().then(()=>pool.query(`SELECT * FROM articles WHERE article_id = ${article_id};`)).then((res)=>{
   const [article] = res.rows; 
    if(!res.rows.length) return Promise.reject({ status: 404, msg: "article not found" });
      return article;
})
};

exports.patchArticleVote = (article_id, inc_votes = 0) => {
  return pool.connect()
  .then(()=>pool.query(`UPDATE articles SET votes = votes + 1 WHERE article_id = '${article_id}' RETURNING *;`)).then((res)=>{
   const [article] = res.rows; 
      return article;
  })
};

exports.createArticle = ({title, body, topic, author} )=>{
 
  const checkUser = getUsersByUsername(author);
  return  Promise.all([checkUser]).then(()=>{
    return pool.connect()
    .then(()=>pool.query(`INSERT INTO articles(title, body, topic, author) VALUES('${removeApostraphe(title)}', '${removeApostraphe(body)}', '${topic}', '${removeApostraphe(author)}') RETURNING *;`))
    .then((res)=>{
     const [article] = res.rows;
     article.title = addApostraphe(article.title);
     article.body = addApostraphe(article.body);
     article.author = addApostraphe(article.author);
      return article;
    }).catch((err)=>console.log(err))
  })


}