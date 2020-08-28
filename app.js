const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("./routers/api.router");
const {
  customErrorHandler,
  PSQLerrorHandler,
  serverErrorHandler,
} = require("./errors");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrorHandler);
app.use(PSQLerrorHandler);
app.use(serverErrorHandler);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not found!" });
});
module.exports = { app };
