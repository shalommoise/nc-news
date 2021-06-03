const ENV = process.env.NODE_ENV || "production";
const testData = require("./test-data");
const developmentData = require("./development-data");

const data = {
  test: testData,
  development: developmentData,
  production: developmentData,
};
module.exports = data[ENV];
