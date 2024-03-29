const request = require("supertest");
const {app} = require("../app");

// const {runSeed} =require("../db/run-seed")

describe("/api", () => {
  // beforeEach(() => runSeed());
  // afterAll(() => pool.destroy());
  test("All: 404 error from mispelling url", () => {
    return request(app)
      .get("/api/tpics/")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("Not found!");
      });
  });
  describe("/topics", () => {
    test("GET: 200: return full topics table", () => {
      return request(app)
        .get("/api/topics/")
        .expect(200)
        .then((res) => {
          res.body.topics.forEach((topic) =>
            expect(Object.keys(topic)).toEqual(["slug", "description"])
          );
        });
    });
  describe("/:topic", ()=>{
    test("GET: 200: returns single topic", ()=>{
      return request(app)
        .get("/api/topics/paper")
        .expect(200)
        .then((res)=>{
          expect(res.body.topic.slug).toBe("paper");
          expect(res.body.topic.description).toBe("what books are made of")
        })
    })
    test("ERR: 404 Topic does not exist", ()=>{
       return request(app)
        .get("/api/topics/notHere")
        .expect(404)
        .then((res)=>{
          expect(res.body.msg).toBe('"notHere" is not currently a topic');
         
        })
    })
  })
  });
  describe("users", () => {
    test("GET: 200: return full users table", () => {
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
      test("GET: 200 return details of user by username", () => {
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
      test("Not found: 404: username not found", () => {
        return request(app)
          .get("/api/users/brian")
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({ msg: 'User not found' });
          });
      });
      test("Method Error: 405: PUT", () => {
        return request(app).put("/api/users/butter_bridge").expect(405);
      });
    });
  });
  describe("/articles", () => {
    test("GET: 200: return full articles table", () => {
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
      test("GET: 200: returns specific article based on article_id", () => {
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
      test("GET: 200: returns specific article based on article_id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            expect(res.body.article.article_id).toBe(1);
          });
      });
      test("GET: 200: returns specific article based on article_id", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then((res) => {
            expect(res.body.article.article_id).toBe(2);
          });
      });
      test("GET: 200: returns sepcific article with comment_count", () => {
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
      test("PATCH: 200: updates the votes item in the article", () => {    
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
      test("POST 201 new article", ()=>{
        return request(app)
        .get("/api/articles/")
        .then((res)=>{
          const articlesCount = res.body.articles.length;
        const newArticle = {title: "Making databases", body: "The tricky part about databases is in maintaining them. You can build a perfectly good api... and then a few months later... some random update just stops it from working!",topic: "mitch", author: "butter_bridge" }
        return request(app)
        .post("/api/articles/")
        .send(newArticle)
        .expect(201)
        .then((res)=>{
          const {title, body, topic, author, article_id, comment_count, votes} = res.body.article
           expect(article_id).toBe(articlesCount + 1);
          expect(title).toBe("Making databases");
          expect(body).toBe(newArticle.body);
          expect(author).toBe("butter_bridge");
          expect(topic).toBe("mitch");
          expect(votes).toBe(0);
          expect(comment_count).toBe(0);
        })
        })
      })
      test("POST 201 new article with apostarphes", ()=>{
        const newArticle = {title: "Apostarphe's", body: "I'm not sure if this will work, I guess we'll see. ",topic: "mitch", author: "butter_bridge" }
        return request(app)
        .post("/api/articles/")
        .send(newArticle)
        .expect(201).then((res)=>{
           const {title, body, topic, author, comment_count, votes} = res.body.article
          expect(title).toBe("Apostarphe's");
          expect(body).toBe(newArticle.body);
          expect(author).toBe("butter_bridge");
          expect(topic).toBe("mitch");
          expect(votes).toBe(0);
          expect(comment_count).toBe(0);
        })
      })
      describe("/:article_id errors", () => {
        test("Not found: 404: article_id does not exist", () => {
          return request(app)
            .get("/api/articles/400")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("article not found");
            });
        });
        test("Bad Request: 400: invalid article_id", () => {
          return request(app)
            .get("/api/articles/lion")
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe("bad request");
            });
        });
        test("Not found: 404: Post article with unkonwn user", () => {
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
        test.only("PATCH ERR, inc_votes empty, defaults to add to 0", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).toEqual(100);
            });
        });
        test("PATCH ERR 400, inc_votes is not a number", () => {
          const newVote = { inc_votes: "100" };
          return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe("Bad Request");
            });
        });
        test("Method error: 405: try to delete or put an article", () => {
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
        test("POST: 201, creates comments on articles", () => {
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
         test("POST: 201, creates comments on articles with apostarphes", () => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({ username: "rogersop", body: "Favourite of butterbridge's article!" })
            .expect(201)
            .then((res) => {
              expect(res.body.comment).toEqual(
                expect.objectContaining({
                  article_id: 5,
                  author: "rogersop",
                  body: "Favourite of butterbridge's article!",
                  comment_id: expect.any(Number),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
        });
        test("GET: 200, recieves specific comments by article_id", () => {
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
        test("GET 200 comments by article_id sorted by any column, deafults to created_at", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((res) => {
              expect(res.body.comments).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
        test("GET: 200: comments by article_id, sorted by any valid column", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
            .expect(200)
            .then((res) => {
              expect(res.body.comments).toBeSortedBy("comment_id");
            });
        });
        test("GET: 200: comments by article_id, sorted by any valid column, in desc or asc order", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id&order=desc")
            .expect(200)
            .then((res) => {
              expect(res.body.comments).toBeSortedBy("comment_id", {
                descending: true,
              });
            });
        });
        test("GET: 200: comments by article_id, sorted by votes", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then((res) => {
              expect(res.body.comments).toBeSortedBy("votes", {
                descending: true,
              });
            });
        });
        test("GET: 200: empty array for article with no comments", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then((res) => {
              expect(res.body.comments).toEqual([]);
            });
        });
        describe("comments errors", () => {
          test("POST error, missing username", () => {
            return request(app)
              .post("/api/articles/5/comments")
              .send({ body: "Great article!" })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe("bad request");
              });
          });
          test("POST error, article not found", () => {
            return request(app)
              .post("/api/articles/1000/comments")
              .send({ username: "rogersop", body: "Great article!" })
              .expect(404)
              .then((res) => {
                expect(res.body.msg).toBe("article not found");
              });
          });
          test("GET error, sort comments by column that does not exist", () => {
            return request(app)
              .get("/api/articles/?sort_by=likes")
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe("bad request");
              });
          });

          test("404, article does not exist", () => {
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
    test("GET: 200: get comment count for articles", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then((res) => {
           let totalCount = 0;
          res.body.articles.forEach((article) => {
            totalCount += article.comment_count
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
             expect(totalCount).not.toBe(0)
        });
    });
    test("GET: 200: all articles sorted by deafult to date", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("GET: 200: sort articles by any valid column in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=desc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("topic", {
            descending: true,
          });
        });
    });
    test("GET: 200: sort article by author in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("GET: 200: order article by ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at", {
            ascending: true,
          });
        });
    });
    test("GET: 200: filters the articles by author", () => {
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
    test("GET: 200: filters the articles by topic", () => {
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
      test("GET: 200: filters the articles by author & topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch&author=icellusedkars")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBeGreaterThan(0);
          res.body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
            expect(article.author).toBe("icellusedkars");
          });
        });
    });
    test("GET: 200: returns empty array for author that does not exist", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBe(0);
        });
    });
    test("GET: 200: returns empty array for topic that does not exist", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBe(0);
        });
    });
    describe("/articles errors", () => {
      test("Patch Method Error: 405", () => {
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
    test("PATCH 200: updates the votes item in the comments", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: -2 })
        .expect(200)
        .then((res) => {
          expect(res.body.comment.votes).toBe(12);
        });
    });
    test("GET: 200: returns list of all comments", () => {
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
    test("DELETE: 204: removes a comment by comment_id", () => {
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
    
      test("PATCH ERR Not found: 404: try to patch a comment that does not exist", () => {
        return request(app)
          .patch("/api/comments/1000")
          .send({ inc_votes: 12 })
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("comment not found");
          });
      });
      test("PATCH ERR: 400: try to change vote by a non-number", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: "thirty" })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
      test("PATCH ERR, no inc_Votes, returns comment unchanged", () => {
        return request(app)
          .patch("/api/comments/3")

          .expect(200)
          .then((res) => {
            expect(res.body.comment.votes).toBe(100);
          });
      });
      test("Method Error: 405: PUT", () => {
        return request(app).put("/api/comments/1").expect(405);
      });
    });
  });
  test("GET: 200: returns JSON describing available endpoints", () => {
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
    test("Method Error: 405: DELETE", () => {
      return request(app).del("/api").expect(405);
    });
  });
});
