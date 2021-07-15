const { getTopics, getSingleTopic } = require("../models/topics.model");

exports.sendTopics = (req, res, next) => {
  getTopics()
    .then((topics) => res.send({ topics }))
    .catch(next);
};

exports.sendSingleTopic = (req, res, next)=>{
  const {slug} = req.params;
getSingleTopic(slug)
.then((topic)=> {
  if(!topic) return Promise.reject({ status: 404, msg: `"${slug}" is not currently a topic` })
  res.send({topic})})
  .catch(next);

}