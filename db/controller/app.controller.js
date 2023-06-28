const { getTopics, getArticleById } = require("../model/app.model");
const endpointData = require("../../endpoints.json");

const searchTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const searchEndpoints = (req, res) => {
  res
    .status(200)
    .send({ endpointData })
    .catch((err) => {
      next(err);
    });
};

const searchArticleById = (req, res) => {
  const { article_id } = req.params;
  getArticleById(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

module.exports = { searchTopics, searchEndpoints, searchArticleById };
