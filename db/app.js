const express = require("express");
const app = express();
const getTopics = require("../db/controller/app.controller");

app.get("/api/topics", getTopics);

module.exports = app;
