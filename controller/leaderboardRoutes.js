const leaderboardService = require("../service/leaderboardService");
const config = require("../config");

function leaderboardRoutes({ db, app }) {
  app.post(config.baseUrl + "/get-all-tournaments", (req, res) => {
    leaderboardService.getAllTournaments(db, (tournaments) => {
      res.send(tournaments);
    });
  });

  app.post(config.baseUrl + "/get-tournament-ids", (req, res) => {
    leaderboardService.getTournamentIds(db, req.body, (tournaments) => {
      res.send(tournaments);
    });
  });
}

module.exports = leaderboardRoutes;
