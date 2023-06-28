const express = require("express");
const app = express();
const {
  searchTopics,
  searchEndpoints,
} = require("../db/controller/app.controller");

app.get("/api/topics", searchTopics);

app.get("/api", searchEndpoints);

app.all("*", (_, res) => {
  res.status(404).send({ status: 404, msg: "Not found" });
});

app.use((err, req, res, next) => {
  return res.status(500).send({ mgs: "Internal Server Error" });
});


module.exports = app;
