const mysql = require("mysql");
const config = require("../config");

module.exports = () => {
  return mysql.createConnection({
    host: config.mysql.host,
    port: config.mysql.port,
    password: config.mysql.password,
    user: config.mysql.user,
    database: config.mysql.database,
  });
};
