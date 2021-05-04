const client = require("../db/connection");

exports.getTopics = () =>
   client.connect()
  .then(()=>client.query("SELECT * FROM topics;"))
 .then((res) => res.rows);




