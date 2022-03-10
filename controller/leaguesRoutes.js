const leaguesService = require("../service/leaguesService");

function leaguesRoutes({ db, app }) {
  app.post("/get-users-leagues", (req, res) => {
    leaguesService.getUsersLeagues(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post("/get-league-info", (req, res) => {
    leaguesService.getLeagueInfo(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post("/create-new-league", (req, res) => {
    leaguesService.createNewLeague(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post("/join-league", (req, res) => {
    leaguesService.joinLeague(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post("/get-leagues-without-user", (req, res) => {
    leaguesService.getLeaguesWithoutUser(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post("/get-league-name", (req, res) => {
    leaguesService.getLeagueName(db, req.body, (result) => {
      res.send(result);
    });
  });
}

module.exports = leaguesRoutes;
