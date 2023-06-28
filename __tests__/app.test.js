const db = require("../db/connection");
const app = require("../db/app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointData = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("Should return status of 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("Should return all topics with properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET /api", () => {
  test("Should return status of 200 and a JSON object with information on each available endpoint.  Each must include a description, accepted queries, request body format and an example response", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpointData).toEqual(endpointData);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Should return a status of 200 and repsond with an object containing the relevant article based on its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("should respond with 400 error when article_id is an invalid type", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then(({ body }) => {
        console.log(body);
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("Should respond with 404 Not Found if given valid article_id but which has no corresponding article", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        console.log(body);
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("ALL non-existent path", () => {
  test("Should respond with 404 Not Found if path is invalid", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
