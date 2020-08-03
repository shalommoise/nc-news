exports.formatDates = (list) => {
  const newList = list.map((item) => {
    item.created_at = new Date(item.created_at);

    return item;
  });
  console.log(newList);
  return newList;
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
