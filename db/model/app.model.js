const db = require("../connection");

const getTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

module.exports = getTopics;
