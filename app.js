const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const {
  customErrorHandler,
  PSQLerrorHandler400,
  serverErrorHandler,
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrorHandler);
app.use(PSQLerrorHandler400);
app.use(serverErrorHandler);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not found!" });
});
module.exports = app;
