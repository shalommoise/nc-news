const{ pool }= require("../db/connection");

exports.getTopics = () =>

  pool.query("SELECT * FROM topics;")
 .then((res) => {
   return res.rows
})




exports.getSingleTopic = (slug) =>
pool.query(`SELECT * FROM topics WHERE slug = '${slug}';`)
.then((res)=>{
const [topic] = res.rows;
return topic;
})