const { getTopics, getSingleTopic } = require("../models/topics.model");

exports.sendTopics = (req, res, next) => {
  getTopics()
    .then((topics) => res.send({ topics }))
    .catch(next);
};

exports.sendSingleTopic = (req, res, next)=>{
  const {slug} = req.params
getSingleTopic(slug)
.then((topic)=> res.send({topic}))

}