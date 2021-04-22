const client = require("../connection")
client.connect()
.then(()=>client.query('CREATE TABLE topics (slug) PRIMARY VARCHAR , description VARCHAR'))