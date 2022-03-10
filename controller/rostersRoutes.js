const rostersService = require("../service/rostersService");
const homeService = require("../service/homeService");

function rostersRoutes({ app, db }) {
  app.post("/get-all-users-rosters", (req, res) => {
    rostersService.getInitialRosterInfo(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post("/can-rosters-be-created", (req, res) => {
    rostersService.canRostersBeCreated(db, req.body, (result) => {
      res.send({
        canRostersBeCreated: true,
      });
    });
  });

  app.post("/get-players-in-current-tournament", (req, res) => {
    rostersService.getCurrentTournamentPlayers(db, (result) => {
      res.send(result);
    });
  });

  app.post("/get-individual-roster-data", (req, res) => {
    rostersService.getIndividualRosterData(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post("/get-roster-scorecard-data", (req, res) => {
    rostersService.getRosterScorecardData(db, req.body, (result) => {
      res.send(result);
    });
  });

  app.post("/create-new-roster", (req, res) => {
    rostersService.createNewRoster(db, req.body, (result) => {
      res.send(result);
    });
  });
}

module.exports = rostersRoutes;
