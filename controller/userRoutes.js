const userService = require("../service/userService");
const config = require("../config");

const exjwt = require("express-jwt");

function userRoutes({ app, db }) {
  const jwtMW = exjwt({
    secret: "best ball majors super secret sentence",
    algorithms: ["HS256"],
  });

  app.post(config.baseUrl + "/signup", (req, res) => {
    userService.signup(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/log-in", (req, res) => {
    userService.login(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/reset-password-request", (req, res) => {
    userService.resetPasswordRequest(db, req.body, (result) => {
      // res.send(result);
    });
  });

  app.post(config.baseUrl + "/reset-password", (req, res) => {
    userService.resetPassword(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.get(config.baseUrl, jwtMW, (req, res) => {
    res.send("You are authenticated");
  });
}

module.exports = userRoutes;
