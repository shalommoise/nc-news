const{ pool }= require("../db/connection");

exports.getTopics = () =>{

return   pool.connect()
  .then(()=>pool.query("SELECT * FROM topics;"))
 .then((res) => {
   return res.rows
}).catch((err)=>console.log(err))
};

// exports.getSingleTopic = (username) => 
// pool.connect()
// .then(()=>pool.query(`SELECT * FROM users WHERE username='${username}';`))
// .then((res)=>{
//   if(!res.rows.length) return Promise.reject({ status: 404, msg: "User not found" });
// const [results] =  res.rows;
// return results 
// });


exports.getSingleTopic = (slug) =>
pool.connect()
.then(()=>pool.query(`SELECT * FROM topics WHERE slug = '${slug}';`))
.then((res)=>{
const [topic] = res.rows;
return topic;
})