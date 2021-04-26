const { indexOf } = require("../data/development-data/comments");

exports.formatDates = (list) => {
  const newList = list.map((item) => {
    const copy = { ...item };
    const date = new Date(item.created_at);

     copy.created_at = changeDateToSQLFrom(date) 
    

    return copy;
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
const changeDateToSQLFrom =(date)=> {

  const dateArr = date.toString().split(" ");
  
  const end = dateArr[1].split(".")
const newDate = `${dateArr[3]}-${months.indexOf(dateArr[1])}-${dateArr[2]} ${dateArr[4]}`


  return newDate;
}
const months = ['', 'Jan', 'Feb', 'Mar', 'Apr','May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']