const pool = require("../db/connection");


exports.getUsers = () => 
 pool.connect()
  .then(()=>pool.query("SELECT * FROM users;"))
 .then((res) => res.rows);


exports.getUsersByUsername = (username) => 
pool.connect()
.then(()=>pool.query(`SELECT * FROM users WHERE username='${username}';`))
.then((res)=>{
  if(!res.rows.length) return Promise.reject({ status: 404, msg: "User not found" });
const [results] =  res.rows;
return results 
});

// exports.getUsersByUsername = (username) => {
//   return connection
//     .select("*")
//     .from("users")
//     .where("username", username)
//     .then((results) => {
//       if (results.length === 0)
//         return Promise.reject({ status: 404, msg: "User not found" });
//       return results[0];
//     });
// };