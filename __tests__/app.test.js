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
  test("Should return a status of 200 and respond with a single article object which has article_id 1", () => {
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
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("Should respond with 404 Not Found if given valid article_id but which has no corresponding article", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("Should respond with 200 and return an array of all articles with correct properties listed by created date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("Should sort articles by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should respond with 200 and list of comments sorted by date, with most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
      });
  });
  test("Should respond with 200 if given valid article_id with existing article but which has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(0);
      });
  });
  test("Should respond with 404 Not Found if given valid article_id but which has no corresponding article or comments", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("should respond with 400 error when article_id is an invalid type when looking for its comments", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  it("Responds with an array of user objects, with properties username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toEqual(4);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should increment article votes by 1", () => {
    const newVote = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/4")
      .send(newVote)
      .expect(202)
      .then(({ body }) => {
        expect(body.article.votes).toBe(1);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Should respond with 201 and respond with the posted comment after being added to db", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This comment sure seems pointless!",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "This comment sure seems pointless!",
          article_id: 3,
          author: "icellusedkars",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
});

test("Should respond with 400 Bad Request when article_id is an invalid type when trying to post comment", () => {
  const newComment = {
    username: "icellusedkars",
    body: "This comment sure seems pointless!",
  };
  return request(app)
    .post("/api/articles/notanumber/comments")
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
// test("Should respond with 400 Bad Request when posting a comment with incorrect author type", () => {
//   const newCommentBadAuthor = {
//     username: 2,
//     body: "This comment sure seems pointless!",
//   };
//   return request(app)
//     .post("/api/articles/3/comments")
//     .send(newCommentBadAuthor)
//     .expect(404)
//     .then(({ body }) => {
//       expect(body.msg).toBe("Not Found");
//     });
// });
test("Should respond with 400 Bad Request when posting a comment with non-existent author", () => {
  const newCommentBadAuthor = {
    username: "joe",
    body: "This comment sure seems pointless!",
  };
  return request(app)
    .post("/api/articles/3/comments")
    .send(newCommentBadAuthor)
    .expect(400);
});
test("Should respond with 404 Not Found if given valid article_id but which has no corresponding article or comments", () => {
  return request(app)
    .get("/api/articles/9999/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not Found");
    });
});

// describe("DELETE /api/comments/:comment_id", () => {
//   it("Should delete given comment by comment_id", () => {
//     return request(app).delete("/api/comments/1").expect(204);
//   });
// });
// it("Return 400 error for invalid comment ID", () => {
//   return request(app)
//     .delete("/api/comments/notanumber")
//     .expect(400)
//     .then(({ body }) => {
//       expect(body.msg).toEqual("Invalid ID type");
//     });
// });
// it("Return 404 error for invalid comment ID", () => {
//   return request(app)
//     .delete("/api/comments/9999")
//     .expect(404)
//     .then(({ body }) => {
//       expect(body.msg).toEqual("Valid ID type but no comment found");
//     });
// });

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
