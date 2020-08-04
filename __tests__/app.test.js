const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const { intersect } = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  afterAll(() => connection.destroy());
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
});
