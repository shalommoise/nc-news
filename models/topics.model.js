const{ pool }= require("../db/connection");

exports.getTopics = () =>{

return   pool.connect()
  .then(()=>pool.query("SELECT * FROM topics;"))
 .then((res) => {
   return res.rows
}).catch((err)=>console.log(err))
};




