exports.up = function (knex) {
  console.log("creating Topics Table");
  return knex.schema.createTable("Topics", (topicsTable) => {
    topicsTable.string("slug").primary();
    topicsTable.string("description");
  });
};

exports.down = function (knex) {};
