const db = require("../db/connection");
const app = require("../db/app.js");
const request = require("supertest");

afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  test("Should return status of 200", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("all okay so far!");
      });
  });
});
