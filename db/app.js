const express = require("express");
const app = express();
const searchTopics = require("../db/controller/app.controller");

app.get("/api/topics", searchTopics);

app.all("*", (_, res) => {
  res.status(404).send({ status: 404, msg: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ mgs: "Internal Server Error" });
});

module.exports = app;
