const expressLoader = require("./express");
const mysqlLoader = require("./mysql");

module.exports = async function ({ app }) {
  const mysqlConnection = await mysqlLoader();
  console.log("MySQL Initialized");
  await expressLoader({ app });
  console.log("Express Initialized");
  return mysqlConnection;
};
