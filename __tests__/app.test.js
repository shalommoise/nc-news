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
    describe.only("/:username", () => {
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
      it.only("GET: 200 return details if user by avatar_url", () => {
        return (
          request(app)
            .get(
              "/api/users/https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            )
            // .expect(200)
            .then((res) => {
              expect(res.body.user[0]).toEqual({
                username: "butter_bridge",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                name: "jonny",
              });
            })
        );
      });
    });
  });
  describe("/articles/", () => {
    it("GET: 200: return full topics table", () => {
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
      // it("PATCH: 200- can change details in article that are not dpendent on other tables: -body ")
    });
  });
});
