const {pool, client} = require("../connection.js");

const { formatDates, formatComments, makeRefObj, removeApostraphe} = require("../utils/utils");
const {commentCountConverter} = require("../utils/pqslUtils")
exports.seed = function (topicData, articleData, commentData, userData) {
   pool.connect()
.then(()=>console.log("connected successfully"))
.then(()=> pool.query('DROP TABLE IF EXISTS topics, users, articles, comments;'))
.then(()=>pool.query('CREATE TABLE topics (slug VARCHAR , description VARCHAR, PRIMARY KEY (slug));'))
.then(()=>pool.query("CREATE TABLE users (username VARCHAR NOT NULL, avatar_url VARCHAR DEFAULT 'Picture not available', name VARCHAR NOT NULL, PRIMARY KEY (username));"))
.then(()=>pool.query('CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR NOT NULL, body VARCHAR NOT NULL, votes INT DEFAULT 0, comment_count INT DEFAULT 0, topic VARCHAR, author VARCHAR NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(topic) REFERENCES topics(slug), FOREIGN KEY(author) REFERENCES users(username));'))
.then(()=>pool.query('CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, author VARCHAR NOT NULL, article_id INT NOT NULL, votes INT DEFAULT 0,body VARCHAR NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(author) REFERENCES users(username), FOREIGN KEY(article_id) REFERENCES articles(article_id));'))
.then(()=> {
    const slugs = topicData.map((datum)=> datum.slug);
    const descriptions = topicData.map((datum)=> datum.description); 
    const insertTopics = (n) => pool.query(`INSERT INTO topics (slug, description) VALUES ('${slugs[n]}' , '${descriptions[n]}');`)
    .then(()=>n < slugs.length - 1 && insertTopics(n + 1))
   const usernames = userData.map((datum)=> datum.username);
   const names = userData.map((datum)=> datum.name);
   const avatar_urls = userData.map((datum)=> datum.avatar_url);
  
     const insertUsers = (n) => pool.query(`INSERT INTO users (username, name, avatar_url) VALUES ('${usernames[n]}' , '${names[n]}', '${avatar_urls[n]}');`)
     .then(()=>n < userData.length - 1 && insertUsers(n + 1));
      return Promise.all([insertTopics(0), insertUsers(0)]).then(() => {
       
        const formattedArticlesTimes = formatDates(articleData);
        const titles = formattedArticlesTimes.map((datum)=> removeApostraphe(datum.title));
        const topics = formattedArticlesTimes.map((datum)=> datum.topic);
        const authors = formattedArticlesTimes.map((datum)=> datum.author);
        const bodies = formattedArticlesTimes.map((datum)=> removeApostraphe(datum.body));
        const times = formattedArticlesTimes.map((datum)=> datum.created_at);
        const votes =  formattedArticlesTimes.map((datum)=> datum.votes ? datum.votes : 0);
     
      const insertArticles = (n)=> pool.query(`INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES ('${titles[n]}', '${topics[n]}', '${authors[n]}','${bodies[n]}', '${times[n]}', '${votes[n]}')`)
      .then(()=>n < formattedArticlesTimes.length - 1 && insertArticles(n + 1));
      return insertArticles(0);
 })
.then(() => {
   const articles = ()=> pool.query("SELECT * FROM articles;")

return  articles().then((res)=>{
  const articleRows = res.rows;
  const articleRef = makeRefObj(articleRows);  
  const newDates = formatDates(commentData);
  const formattedComments = formatComments(newDates, articleRef);
  const authors = formattedComments.map((datum)=> datum.author);
  const bodies = formattedComments.map((datum)=> removeApostraphe(datum.body));
   const times = formattedComments.map((datum)=> datum.created_at);
   const votes =formattedComments.map((datum)=> datum.votes ? datum.votes : 0);
   const article_ids = formattedComments.map((datum)=>datum.article_id);

   const insertComments =(n)=>{
    return pool.query(`INSERT INTO comments (author, article_id, votes, body, created_at) VALUES ('${authors[n]}', '${article_ids[n]}', '${votes[n]}','${bodies[n]}', '${times[n]}')`).then(()=>n < formattedComments.length - 1 && insertComments(n + 1))
   }
  return insertComments(0);
})
})
.then(()=>commentCountConverter())
})
.catch((e)=>console.log("err: ", e))
.finally(()=> console.log("seeding has been completed"))
};
