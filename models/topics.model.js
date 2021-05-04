const pool = require("../db/connection");

exports.getTopics = () =>
   pool.connect()
  .then(()=>pool.query("SELECT * FROM topics;"))
 .then((res) => res.rows);




