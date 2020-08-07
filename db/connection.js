const knex = require("knex");
const config = require("../instructions/knexfile");

module.exports = knex(config);
