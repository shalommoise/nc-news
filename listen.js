

const { app } = require("./app");
app.listen(process.env.PORT || 9090, () => console.log(`Listening on ${process.env.PORT|| 9090}...`));
