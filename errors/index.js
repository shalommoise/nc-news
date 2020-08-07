exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.PSQLerrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "bad request" });
  } else if (err.code === "42P01") {
    return res.status(406).send({ msg: "missing user information" });
  }
  if (err.code === "42703") {
    return res.status(400).send({ msg: "column not valid" });
  } else {
    next(err);
  }
};

exports.serverErrorHandler = (err, req, res, next) => {
  console.log(err);
  return res.status(500).send({ msg: "Server Error" });
};
