const {pool} = require("../connection");

exports.commentCountConverter =()=> pool.query("SELECT articles.article_id, COUNT(articles.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = comments.article_id GROUP BY articles.article_id;").then((res)=>{
    const articlesWithComments = res.rows;
const insertCommentCount =(n)=>pool.query(`UPDATE articles SET comment_count = ${articlesWithComments[n].comment_count} WHERE articles.article_id= ${articlesWithComments[n].article_id};`).then(()=>n < articlesWithComments.length - 1 && insertCommentCount(n + 1));
return insertCommentCount(0);  
})
