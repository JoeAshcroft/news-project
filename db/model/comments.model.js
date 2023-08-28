const db = require("../connection");

const checkCommentAuthorExists = (article_id, author) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1 AND author = $2", [
      article_id,
      author,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return [];
    });
};

module.exports = checkCommentAuthorExists;
