const {
  getAllArticles,
  getArticleById,
  patchArticleVote,
  createArticle
} = require("../models/articles.model");

exports.sendAllArticles = (req, res, next) => {
  getAllArticles(req.query)
    .then((articles) => {
      res.send({ articles });
    })
    .catch(next);
};

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;

  getArticleById(article_id)
    .then((article) => {
      res.send({  article });
    })
    .catch(next);
};

exports.updateArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchArticleVote(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article: { article } });
    })
    .catch(next);
};

exports.postArticle = (req,res,next)=>{
   createArticle(req.body)
  .then((article)=>{
 res.status(201).send({ article });
})
.catch(next);

}