const express = require("express");
const app = express();
const {
  searchTopics,
  searchEndpoints,
  searchArticleById,
  searchArticles,
  searchCommentsByArticleId,
  addComment,
  updateArticleVote,
} = require("../db/controller/app.controller");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api/topics", searchTopics);

app.get("/api", searchEndpoints);

app.get("/api/articles", searchArticles);

app.get("/api/articles/:article_id", searchArticleById);

app.get("/api/articles", searchArticles);

app.get("/api/articles/:article_id/comments", searchCommentsByArticleId);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", updateArticleVote);

app.all("*", (_, res) => {
  res.status(404).send({ status: 404, msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(404).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ mgs: "Internal Server Error" });
});

module.exports = app;
