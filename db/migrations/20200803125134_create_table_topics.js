exports.up = function (knex) {
  //console.log("creating topics Table");
  return knex.schema.createTable("topics", (topicsTable) => {
    topicsTable.string("slug").primary().notNullable();
    topicsTable.string("description");
  });
};

exports.down = function (knex) {
  //console.log("dropping topics Table");
  return knex.schema.dropTable("topics");
};
