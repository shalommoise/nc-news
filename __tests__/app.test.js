const request = require("supertest");
const {app} = require("../app");
const pool = require("../db/connection");
// const {runSeed} =require("../db/run-seed")

describe("/api", () => {
  // beforeEach(() => runSeed());
  // afterAll(() => pool.destroy());
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
          console.log(res.body)
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
          expect(res.body.users[2].name).toBe("paul");
        });
    });
    describe("/:username", () => {
      it("GET: 200 return details of user by username", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then((res) => {
            expect(res.body.user).toEqual({
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
      it("Method Error: 405: PUT", () => {
        return request(app).put("/api/users/butter_bridge").expect(405);
      });
    });
  });
  describe("/articles", () => {
    it("GET: 200: return full articles table", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then((res) => {
         
          res.body.articles.forEach((article) =>{
         
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
          
          }
            );
        });
    });
    describe("/:article_id", () => {
      it("GET: 200: returns specific article based on article_id", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then((res) => {
            expect(res.body.article.article_id).toBe(5);
            expect(res.body.article.title).toBe(
              "UNCOVERED: catspiracy to bring down democracy"
            );
          });
      });
      it("GET: 200: returns specific article based on article_id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            expect(res.body.article.article_id).toBe(1);
          });
      });
      it("GET: 200: returns specific article based on article_id", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then((res) => {
            expect(res.body.article.article_id).toBe(2);
          });
      });
      it("GET: 200: returns sepcific article with comment_count", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then((res) => {
            expect(res.body.article).toEqual(
              expect.objectContaining({
                comment_count: expect.any(Number),
              })
            );
          });
      });
      it.only("PATCH: 200: updates the votes item in the article", () => {
      
        
        return request(app)
          .get("/api/articles/1").then((res)=>{
            const oldVotes = res.body.article.votes;
              const newVote = { inc_votes: 1 };
        return request(app)
          .patch("/api/articles/1")
          .send(newVote)
          .expect(200)
          .then((res) => {
            expect(res.body.article.votes).toEqual(oldVotes + 1);
          });    
          })
        
      });
      it("POST 201 new article", ()=>{
        const newArticle = {title: "Making databases", body: "The tricky part about databases is in maintaining them. You can build a perfectly good api... and then a few months later... some random update just stops it from working!",topic: "mitch", author: "butter_bridge" }
        return request(app)
        .post("/api/articles/")
        .send(newArticle)
        .expect(201)
        .then((res)=>{
          const {title, body, topic, author, article_id, comment_count, votes, created_at} = res.body.article
           expect(article_id).toBe(13);
          expect(title).toBe("Making databases");
          expect(body).toBe(newArticle.body);
          expect(author).toBe("butter_bridge");
          expect(topic).toBe("mitch");
          expect(votes).toBe(0);
          expect(comment_count).toBe(0);
        })
      })
      describe("/:article_id errors", () => {
        it("Not found: 404: article_id does not exist", () => {
          return request(app)
            .get("/api/articles/15")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("article not found");
            });
        });
        it("Bad Request: 400: invalid article_id", () => {
          return request(app)
            .get("/api/articles/lion")
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe("bad request");
            });
        });
        it("Not found: 404: Post article with unkonwn user", () => {
          const newArticle = {title: "Errors", body: "Love some good error handling",topic: "mitch", author: "noOne" }
          return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("User not found");
            });
        });
        // it.only("Not found: 404: Post article with unkonwn user", () => {
        //   const newArticle = {title: "Errors", body: "Love some good error handling",topic: "notATopic", author: "butter_bridge" }
        //   return request(app)
        //     .post("/api/articles")
        //     .send(newArticle)
        //     .expect(404)
        //     .then((res) => {
        //       expect(res.body.msg).toBe("Topic not Found");
        //     });
        // });
        it("PATCH ERR, inc_votes empty, defaults to add to 0", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .then((res) => {
              expect(res.body.article.article.votes).toEqual(100);
            });
        });
        it("PATCH ERR 400, inc_votes is not a number", () => {
          const newVote = { inc_votes: "100" };
          return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe("Bad Request");
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
              expect(res.body.comment).toEqual(
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
        it("GET: 200, recieves specific comments by article_id", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then((res) => {
              expect(res.body.comments.comments.length).toBeGreaterThan(0);
              res.body.comments.comments.forEach((comment) => {
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
              expect(res.body.comments).toBeSortedBy("created_at", {
                descending: true,
              });
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
        it("GET: 200: comments by article_id, sorted by votes", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then((res) => {
              expect(res.body.comments).toBeSortedBy("votes", {
                descending: true,
              });
            });
        });
        it("GET: 200: empty array for article with no comments", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then((res) => {
              expect(res.body.comments.comments).toEqual([]);
            });
        });
        describe("comments errors", () => {
          it("POST error, missing username", () => {
            return request(app)
              .post("/api/articles/5/comments")
              .send({ body: "Great article!" })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe("bad request");
              });
          });
          it("POST error, article not found", () => {
            return request(app)
              .post("/api/articles/1000/comments")
              .send({ body: "Great article!" })
              .expect(404)
              .then((res) => {
                expect(res.body.msg).toBe("article not found");
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
           let totalCount = 0;
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
             expect(totalCount).not.toBe(0)
          });
        });
    });
    it("GET: 200: all articles sorted by deafult to date", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
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
    it("GET: 200: sort article by author in ascendong order", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    it("GET: 200: order article by ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at", {
            ascending: true,
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
    it("GET: 200: returns empty array for author that does not exist", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBe(0);
        });
    });
    it("GET: 200: returns empty array for topic that does not exist", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBe(0);
        });
    });
    describe("/articles errors", () => {
      it("Patch Method Error: 405", () => {
        return request(app)
          .patch("/api/articles")
          .expect(405)
          .then((res) => {
            expect(res.body.msg).toBe("method not allowed");
          });
      });
    });
  });
  describe("comments/:comment_id", () => {
    it("PATCH 200: updates the votes item in the comments", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: -2 })
        .expect(200)
        .then((res) => {
          expect(res.body.comment.votes).toBe(12);
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
      it("DELETE ERR Not found: 404: try to delete a comment that does not exist", () => {
        return request(app)
          .del("/api/comments/1000")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("comment not found");
          });
      });
      it("PATCH ERR Not found: 404: try to delete a comment that does not exist", () => {
        return request(app)
          .patch("/api/comments/1000")
          .send({ inc_votes: 12 })
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("comment not found");
          });
      });
      it("PATCH ERR: 400: try to change vote by a non-number", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: "thirty" })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
      it("PATCH ERR, no inc_Votes, returns comment unchamged", () => {
        return request(app)
          .patch("/api/comments/2")

          .expect(200)
          .then((res) => {
            expect(res.body.comment.votes).toBe(14);
          });
      });
      it("Method Error: 405: PUT", () => {
        return request(app).put("/api/comments/1").expect(405);
      });
    });
  });
  it("GET: 200: returns JSON describing available endpoints", () => {
    return request(app)
      .get("/api")
      .then((res) => {
        expect(res.body["nc-news"]).toEqual({
          api: {
            topics: { GET: "/" },
            users: { GET: ["/", "/:username"] },
            articles: [
              { GET: ["/", "/:article_id", "/:article_id/comments"] },
              { PATCH: "/:article_id" },
              { POST: "/:article_id/comments" },
            ],
            comments: {
              GET: "/",
              PATCH: "/:comment_id",
              DELETE: "/:comment_id",
            },
          },
        });
      });
  });
  describe("/api errors", () => {
    it("Method Error: 405: DELETE", () => {
      return request(app).del("/api").expect(405);
    });
  });
});
