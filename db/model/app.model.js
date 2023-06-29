const db = require("../connection");

const getTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

const getArticles = () => {
  return db
    .query(
      "SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id, articles.created_at ORDER BY articles.created_at DESC"
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows;
    });
};

const getArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

module.exports = { getTopics, getArticleById, getArticles };
