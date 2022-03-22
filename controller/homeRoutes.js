const homeService = require("../service/homeService");
const config = require("../config");

function homeRoutes({ app, db }) {
  app.get(config.baseUrl + "/get-all-current-tournament-info", (req, res) => {
    homeService.getAllHomePageInfo(db, (result) => {
      res.send(result);
    });
  });

  app.get(config.baseUrl + "/get-current-tournament", (req, res) => {
    homeService.getCurrentTournament(db, (result) => {
      res.send(result);
    });
  });

  app.get(
    config.baseUrl + "/get-current-tournament-leaderboard",
    (req, res) => {
      homeService.getCurrentTournamentLeaderboard(db, (result) => {
        res.send(result);
      });
    }
  );

  //need leaderboard first
  app.get(config.baseUrl + "/get-current-tournament-players", (req, res) => {
    homeService.getCurrentTournamentPlayers(db, (result) => {
      res.send(result);
    });
  });

  app.get(config.baseUrl + "/get-current-tournament-scorecards", (req, res) => {
    homeService.getCurrentTournamentScorecards(db, (result) => {
      res.send(result);
    });
  });
}

module.exports = homeRoutes;
