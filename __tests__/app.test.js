const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const { intersect } = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  afterAll(() => connection.destroy());
  it("All: 404 error from mispelling url", () => {
    return request(app)
      .get("/api/tpics/")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("Not found!");
      });
  });
  describe("/topics", () => {
    it("GET: 200: return full topics table", () => {
      return request(app)
        .get("/api/topics/")
        .expect(200)
        .then((res) => {
          res.body.topics.forEach((topic) =>
            expect(Object.keys(topic)).toEqual(["slug", "description"])
          );
        });
    });
  });
  describe("users", () => {
    it("GET: 200: return full users table", () => {
      return request(app)
        .get("/api/users/")
        .expect(200)
        .then((res) => {
          res.body.users.forEach((user) =>
            expect(Object.keys(user)).toEqual([
              "username",
              "avatar_url",
              "name",
            ])
          );

          expect(res.body.users[0].name).toBe("jonny");
          expect(res.body.users[3].name).toBe("do_nothing");
        });
    });
    describe("/:username", () => {
      it("GET: 200 return details of user by username", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then((res) => {
            expect(res.body.user[0]).toEqual({
              username: "butter_bridge",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              name: "jonny",
            });
          });
      });
    });
    describe("username error", () => {
      it("Not found: 404: username not found", () => {
        return request(app)
          .get("/api/users/brian")
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({ msg: "User not found" });
          });
      });
    });
  });
  describe("/articles", () => {
    it("GET: 200: return full articles table", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) =>
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number),
              })
            )
          );
        });
    });
    describe("/:article_id", () => {
      it("GET: 200: returns specific article based on article_id", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then((res) => {
            expect(res.body.article[0].article_id).toBe(5);
            expect(res.body.article[0].title).toBe(
              "UNCOVERED: catspiracy to bring down democracy"
            );
          });
      });
      it("GET: 200: returns sepcific article with comment_count", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then((res) => {
            expect(res.body.article[0]).toEqual(
              expect.objectContaining({
                comment_count: expect.any(Number),
              })
            );
          });
      });
      it("PATCH: 200: updates the votes item in the article", () => {
        const newVote = { inc_votes: 20 };
        return request(app)
          .patch("/api/articles/5")
          .send(newVote)
          .expect(200)
          .then((res) => {
            expect(res.body.article[0].votes).toEqual(20);

            expect(res.body.article[0]).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: 20,
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
              })
            );
          });
      });
      describe(":article_id errors", () => {
        it("Not found: 404: article_id does not exist", () => {
          return request(app)
            .get("/api/articles/15")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("article not found");
            });
        });
        it("Not found: 404:, invalid article_id", () => {
          return request(app)
            .get("/api/articles/lion")
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe("bad request");
            });
        });
        it("PATCH ERR, inc_votes is not a number, defaults to add to 0", () => {
          const newVote = { inc_votes: "twenty" };
          return request(app)
            .patch("/api/articles/5")
            .send(newVote)
            .expect(200)
            .then((res) => {
              expect(res.body.article[0].votes).toEqual(0);
            });
        });
        it("Method error: 405: try to delete or put an article", () => {
          const methods = ["del", "put"];
          const promises = methods.map((method) => {
            return request(app)
              [method]("/api/articles/2")
              .expect(405)
              .then((res) => {
                expect(res.body.msg).toBe("method not allowed");
              });
          });
          return Promise.all(promises);
        });
      });
      describe("/comments", () => {
        it("POST: 201, creates comments on articles", () => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({ username: "rogersop", body: "Great article!" })
            .expect(201)
            .then((res) => {
              expect(res.body.comment[0]).toEqual(
                expect.objectContaining({
                  article_id: 5,
                  author: "rogersop",
                  body: "Great article!",
                  comment_id: expect.any(Number),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
        });
        it("GET: 200, recieves specific comments", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then((res) => {
              expect(res.body.comments.length).toBeGreaterThan(0);
              res.body.comments.forEach((comment) => {
                expect(comment).toEqual(
                  expect.objectContaining({
                    comment_id: expect.any(Number),
                    article_id: 5,
                    author: expect.any(String),
                    body: expect.any(String),
                    comment_id: expect.any(Number),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                  })
                );
              });
            });
        });
        it("GET 200 comments by article_id sorted by any column, deafults to created_at", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((res) => {
              expect(res.body.comments).toBeSortedBy("created_at");
            });
        });
        it("GET: 200: comments by article_id, sorted by any valid column", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id")
            .expect(200)
            .then((res) => {
              expect(res.body.comments).toBeSortedBy("comment_id");
            });
        });
        it("GET: 200: comments by article_id, sorted by any valid column, in desc or asc order", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id&order=desc")
            .expect(200)
            .then((res) => {
              expect(res.body.comments).toBeSortedBy("comment_id", {
                descending: true,
              });
            });
        });
        describe("comments errors", () => {
          it("POST error, missing username", () => {
            return request(app)
              .post("/api/articles/5/comments")
              .send({ body: "Great article!" })
              .expect(406)
              .then((res) => {
                expect(res.body.msg).toBe("missing user information");
              });
          });
          it("GET error, sort comments by column that does not exist", () => {
            return request(app)
              .get("/api/articles/?sort_by=likes")
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe("column not valid");
              });
          });
          it("200, article has no comments", () => {
            return request(app)
              .get("/api/articles/3/comments")
              .expect(200)
              .then((res) => {
                console.log(res.body);
                expect(res.body.msg).toBe("article has no comments");
              });
          });
          it("404, article does not exist", () => {
            return request(app)
              .get("/api/articles/20/comments")
              .expect(404)
              .then((res) => {
                expect(res.body.msg).toBe("article not found");
              });
          });
        });
      });
    });
    it("GET: 200: get comment count for articles", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    it("GET: 200: all articles sorted by deafult to date", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at");
        });
    });
    it("GET: 200: sort articles by any valid column in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=desc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("topic", {
            descending: true,
          });
        });
    });
    it("GET: 200: filters the articles by author", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBeGreaterThan(0);
          res.body.articles.forEach((article) => {
            expect(article.author).toBe("icellusedkars");
          });
        });
    });
    it("GET: 200: filters the articles by topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBeGreaterThan(0);
          res.body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    describe.only("/articles errors", () => {
      it("Bad request: 400: filter by query that does not exist", () => {
        return request(app)
          .get("/api/articles?topic=notatopic")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("No articles found");
          });
      });
      it("Bad request: 400: filter by column that does not exist", () => {
        return request(app)
          .get("/api/articles?au=butter_bridge")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("invalid search column");
          });
      });
    });
  });
  describe("comments/:comment_id", () => {
    it("PATCH 200: updtes the votes item in the comments", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: -2 })
        .expect(200)
        .then((res) => {
          expect(res.body.comment[0].votes).toBe(12);
        });
    });
    it("GET: 200: returns list of all comments", () => {
      return request(app)
        .get("/api/comments/")
        .expect(200)
        .then((res) => {
          res.body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                body: expect.any(String),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    it("DELETE: 204: removes a comment by comment_id", () => {
      return request(app)
        .del("/api/comments/2")
        .expect(204)
        .then(() => {
          return request(app)
            .get("/api/comments/")
            .then((res) => {
              expect(
                res.body.comments.filter((comment) => {
                  comment.comment_id === 2;
                })
              ).toEqual([]);
            });
        });
    });

    describe("comments/:comment_id errors", () => {
      it("Not found: 404: try to delete a comment that does not exist", () => {
        return request(app)
          .del("/api/comments/19")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("comment not found");
          });
      });
      it("PATCH ERR, try to change vote by a non-number, defaults to add by 0", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: "thirty" })
          .expect(200)
          .then((res) => {
            expect(res.body.comment[0].votes).toBe(14);
          });
      });
    });
  });
});
