const{ pool }= require("../db/connection");

exports.getTopics = () =>{

return   pool.connect()
  .then(()=>pool.query("SELECT * FROM topics;"))
 .then((res) => {
   return res.rows
}).catch((err)=>console.log(err))
};



exports.getSingleTopic = (slug) =>
pool.connect()
.then(()=>pool.query(`SELECT * FROM topics WHERE slug = '${slug}';`))
.then((res)=>{
  // if(!res.rows.length) return Promise.reject({ status: 404, msg: `"${slug}" is not currently a topic` })
const [topic] = res.rows;

return topic;
})