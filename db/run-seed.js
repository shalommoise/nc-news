
const {seed} = require("./seeds/seed");
const {topicData,
  articleData,
  commentData,
  userData} = require("./data/index.js")

const runSeed = async () => {
  seed(topicData, articleData, commentData, userData);
};

runSeed();