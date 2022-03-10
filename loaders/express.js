const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("../config");

function loadExpressApp({ app }) {
  app.use(cors());
  app.use(express.json());

  // app.use(express.static(path.join(__dirname, config.buildFolder)));
  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, config.buildHtml));
  // });

  return app;
}

module.exports = loadExpressApp;
