const { sendInfo } = require("../models/api.model");

exports.getInfo = (req, res, next) => {
  sendInfo()
    .then((api) => {
      res.send({ "nc-news": { api } });
    })
    .catch(next);
};
