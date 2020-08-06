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
    const copy = { ...comment };
    copy.author = copy.created_by;
    copy.article_id = articleRef[copy.belongs_to];

    delete copy.created_by;
    delete copy.belongs_to;
    return copy;
  });

  return newList;
};
