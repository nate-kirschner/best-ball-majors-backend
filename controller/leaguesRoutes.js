const leaguesService = require("../service/leaguesService");
const config = require("../config");

function leaguesRoutes({ db, app }) {
  app.post(config.baseUrl + "/get-users-leagues", (req, res) => {
    leaguesService.getUsersLeagues(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/get-league-info", (req, res) => {
    leaguesService.getLeagueInfo(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/create-new-league", (req, res) => {
    leaguesService.createNewLeague(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/join-league", (req, res) => {
    leaguesService.joinLeague(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/get-leagues-without-user", (req, res) => {
    leaguesService.getLeaguesWithoutUser(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/get-league-name", (req, res) => {
    leaguesService.getLeagueName(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(
    config.baseUrl + "/get-available-leagues-for-new-roster",
    (req, res) => {
      leaguesService.getAvailableLeaguesForNewRoster(db, req.body, (result) => {
        res.send(result);
      });
    }
  );
}

module.exports = leaguesRoutes;
