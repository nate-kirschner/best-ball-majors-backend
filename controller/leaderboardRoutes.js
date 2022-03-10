const leaderboardService = require("../service/leaderboardService");

function leaderboardRoutes({ db, app }) {
  app.post("/get-all-tournaments", (req, res) => {
    leaderboardService.getAllTournaments(db, (tournaments) => {
      res.send(tournaments);
    });
  });
}

module.exports = leaderboardRoutes;
