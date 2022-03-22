const scorecardService = require("../service/scorecardService");
const config = require("../config");

function scorecardRoutes({ app, db }) {
  app.post(config.baseUrl + "/get-scorecard", (req, res) => {
    const params = req.body;
    scorecardService.getScorecardInfo(db, params, (result) => {
      res.send(result);
    });
  });
}

module.exports = scorecardRoutes;
