const client = require("../db/connection");

const getTopics = () =>
   client.connect()
  .then(()=>{
  return  client.query("SELECT * FROM topics;")
  })
   .then((res) => {
     const {rows} = res;
     
      return rows;
    });


module.exports = {getTopics}


