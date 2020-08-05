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
      it("GET: 200 return details if user by username", () => {
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
      it("404, username not found", () => {
        return request(app)
          .get("/api/users/brian")
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({ msg: "User not found" });
          });
      });
    });
  });
  describe("articles", () => {
    it("GET: 200: return full articles table", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) =>
            expect(Object.keys(article)).toEqual([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
            ])
          );
          expect(res.body.articles[0].article_id).toBe(1);
          expect(res.body.articles[5].article_id).toBe(6);
        });
    });
    describe("/:article_id", () => {
      it("GET: 200- Return specific article based on article_id", () => {
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
      it.only("GET: 200: - returns sepcific article with comment_count", () => {
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
      it("PATCH: 200- updates the votes item in the article", () => {
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
      describe("article errors", () => {
        it("404 article_id does not exist", () => {
          return request(app)
            .get("/api/articles/15")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("article not found");
            });
        });
        it("GET 404, invalid article_id", () => {
          return request(app)
            .get("/api/articles/lion")
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe("bad request");
            });
        });
      });
      it.only("GET: 200, recieves specific comments", () => {
        return request(app)
          .get("/api/articles/6/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0]).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                comment_id: expect.any(Number),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
      });
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
    });
  });
});
