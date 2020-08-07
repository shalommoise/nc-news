const { sendInfo } = require("../models/api.model");

exports.getInfo = (req, res, next) => {
  return sendInfo();
};
