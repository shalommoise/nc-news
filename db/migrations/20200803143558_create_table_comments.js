const comments = require("../data/test-data/comments");

exports.up = function (knex) {
  console.log("creating comments Table");
  return knex.schema.createTable("comments", (commentsTable) => {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").references("users.username");
    commentsTable.integer("article_id").references("articles.article_id");
    commentsTable.integer("vote").defaultsTo(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.text("body").notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping comments Table");
  return knex.schema.dropTable("comments");
};
