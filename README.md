# NC-News Backend

## Description

This back-end serves as the api for [nc-news](https://5f5689f5989466a0d4b6e3be--nc-news-byshalommoise.netlify.app/).

It is a relational database, with 4 Tables:

- Users
- Topics
- Articles
- Comments

Users and topics are parents; articles is a child of both users and topics; comments is a child of articles.

## Built With

- [express](https://expressjs.com/) - "Node.js web application framework"
- [knex.js-Postgres](http://knexjs.org/) - "A SQL query builder for JavaScript"

## Testing

- [Jest](https://jestjs.io/) - "Delightful JavaScript testing"
- [supertest module](https://www.npmjs.com/package/supertest) - "HTTP assertions made easy via superagent."

## Available endpoints [API](https://nc-news-shalom.herokuapp.com/api/)

```json
{
  "nc-news": {
    "api": {
      "topics": {
        "GET": "/"
      },
      "users": {
        "GET": ["/", "/:username"]
      },
      "articles": [
        {
          "GET": ["/", "/:article_id", "/:article_id/comments"]
        },
        {
          "PATCH": "/:article_id"
        },
        {
          "POST": "/:article_id/comments"
        }
      ],
      "comments": {
        "GET": "/",
        "PATCH": "/:comment_id",
        "DELETE": "/:comment_id"
      }
    }
  }
}
```

## Links

- [Heroku - back-end app](https://nc-news-shalom.herokuapp.com/api/)

- [GitHub - front-end repo](https://github.com/shalommoise/fe-nc-news)
- [front-end](https://nc-news-byshalommoise.netlify.app/)
