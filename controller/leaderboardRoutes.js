const leaderboardService = require("../service/leaderboardService");
const config = require("../config");

function leaderboardRoutes({ db, app }) {
  app.post(config.baseUrl + "/get-all-tournaments", (req, res) => {
    leaderboardService.getAllTournaments(db, (tournaments) => {
      res.send(tournaments);
    });
  });
}

module.exports = leaderboardRoutes;
