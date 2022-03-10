const homeService = require("../service/homeService");

function homeRoutes({ app, db }) {
  app.get("/get-all-current-tournament-info", (req, res) => {
    homeService.getAllHomePageInfo(db, (result) => {
      res.send(result);
    });
  });

  app.get("/get-current-tournament", (req, res) => {
    homeService.getCurrentTournament(db, (result) => {
      res.send(result);
    });
  });

  app.get("/get-current-tournament-leaderboard", (req, res) => {
    homeService.getCurrentTournamentLeaderboard(db, (result) => {
      res.send(result);
    });
  });

  //need leaderboard first
  app.get("/get-current-tournament-players", (req, res) => {
    homeService.getCurrentTournamentPlayers(db, (result) => {
      res.send(result);
    });
  });

  app.get("/get-current-tournament-scorecards", (req, res) => {
    homeService.getCurrentTournamentScorecards(db, (result) => {
      res.send(result);
    });
  });
}

module.exports = homeRoutes;
