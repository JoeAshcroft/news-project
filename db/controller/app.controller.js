const getTopics = require("../model/app.model");

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
    .send({})
    .catch((err) => {
      next(err);
    });
};

module.exports = { searchTopics, searchEndpoints };
