const scorecardService = require("../service/scorecardService");

function scorecardRoutes({ app, db }) {
  app.post("/get-scorecard", (req, res) => {
    const params = req.body;
    scorecardService.getScorecardInfo(db, params, (result) => {
      res.send(result);
    });
  });
}

module.exports = scorecardRoutes;
