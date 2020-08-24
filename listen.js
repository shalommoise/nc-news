const { PORT = 9090 } = process.env;
const {} = require("./app");
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
