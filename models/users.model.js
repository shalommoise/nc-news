const {pool} = require("../db/connection");


exports.getUsers = () => 
 pool.connect()
  .then(()=>pool.query("SELECT * FROM users;"))
 .then((res) => res.rows);


exports.getUsersByUsername = (username) => 
pool.connect()
.then(()=>pool.query(`SELECT * FROM users WHERE username='${username}';`))
.then((res)=>{
  if(!res.rows.length) return Promise.reject({ status: 404, msg: `User: "${username}" not found` });
const [user] =  res.rows;
return user;
});

