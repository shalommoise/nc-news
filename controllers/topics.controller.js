const { getTopics } = require("../models/topics.model");

exports.sendTopics = (req, res) => {
  getTopics().then((topics) => res.send({ topics }));
};
