exports.formatDates = (list) => {
  const newList = list.map((item) => {
    item.created_at = new Date(item.created_at);

    return item;
  });

  return newList;
};

exports.makeRefObj = (articles) => {
  const lookUpObj = {};
  articles.forEach((article) => {
    const title = article.title;
    const id = article.article_id;
    lookUpObj[title] = id;
  });

  return lookUpObj;
};

exports.formatComments = (comments, articleRef) => {
  const newList = comments.map((comment) => {
    comment.author = comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];

    delete comment.created_by;
    delete comment.belongs_to;
    return comment;
  });

  return newList;
};
