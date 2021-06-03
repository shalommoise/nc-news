const{ pool }= require("../db/connection");

exports.getTopics = () =>{

return   pool.connect()
  .then(()=>pool.query("SELECT * FROM topics;"))
 .then((res) => {
   return res.rows
})
};



exports.getSingleTopic = (slug) =>
pool.connect()
.then(()=>pool.query(`SELECT * FROM topics WHERE slug = '${slug}';`))
.then((res)=>{
const [topic] = res.rows;
return topic;
})