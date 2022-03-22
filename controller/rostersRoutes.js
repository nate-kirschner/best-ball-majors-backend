const rostersService = require("../service/rostersService");
const homeService = require("../service/homeService");
const config = require("../config");

function rostersRoutes({ app, db }) {
  app.post(config.baseUrl + "/get-all-users-rosters", (req, res) => {
    rostersService.getInitialRosterInfo(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/can-rosters-be-created", (req, res) => {
    rostersService.canRostersBeCreated(db, req.body, (result) => {
      res.send({
        canRostersBeCreated: result.canRostersBeCreated,
      });
    });
  });

  app.post(
    config.baseUrl + "/get-players-in-current-tournament",
    (req, res) => {
      rostersService.getCurrentTournamentPlayers(db, (result) => {
        res.send(result);
      });
    }
  );

  app.post(config.baseUrl + "/get-individual-roster-data", (req, res) => {
    rostersService.getIndividualRosterData(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/get-roster-scorecard-data", (req, res) => {
    rostersService.getRosterScorecardData(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/create-new-roster", (req, res) => {
    rostersService.createNewRoster(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/delete-roster", (req, res) => {
    rostersService.deleteRoster(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post(config.baseUrl + "/get-roster-data-from-id", (req, res) => {
    rostersService.getRosterDataFromId(db, req.body, (result) => {
      res.send(result);
    });
  });
}

module.exports = rostersRoutes;
