exports.up = function (knex) {
  //console.log("creating users Table");
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.string("username").primary();
    usersTable.string("avatar_url").defaultTo("Picture not available");
    usersTable.string("name").notNullable();
  });
};

exports.down = function (knex) {
  //  console.log("dropping users Table");
  return knex.schema.dropTable("users");
};
