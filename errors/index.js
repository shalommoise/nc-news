exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.PSQLerrorHandler400 = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.serverErrorHandler = (err, req, res, next) => {
  console.log(err);
  return res.status(500).send({ msg: "Server Error" });
};
