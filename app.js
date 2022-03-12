const express = require("express");
const config = require("./config");
const cron = require("node-cron");
const loaders = require("./loaders");
const homeRoutes = require("./controller/homeRoutes.js");
const scorecardRoutes = require("./controller/scorecardRoutes.js");
const userRoutes = require("./controller/userRoutes");
const rostersRoutes = require("./controller/rostersRoutes");
const leaguesRoutes = require("./controller/leaguesRoutes");
const leaderboardRoutes = require("./controller/leaderboardRoutes");

const addPlayersInTournament = require("./service/addPlayersInTournament");
const addCurrentTournament = require("./service/addCurrentTournament");
const addPlayerScores = require("./service/addPlayerScores");
const addPlayerRankings = require("./service/addPlayerRankings");
const calculateBestBallScores = require("./service/calculateBestBallScores");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

async function startServer() {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
    next();
  });

  const db = await loaders({ app });

  const port = config.port;
  app.listen(port, (err) => {
    if (err) {
      return err;
    }
    console.log(`Server started on port ${port}!`);
  });

  homeRoutes({ app, db });
  scorecardRoutes({ app, db });
  userRoutes({ app, db });
  rostersRoutes({ db, app });
  leaguesRoutes({ db, app });
  leaderboardRoutes({ db, app });

  //cron jobs

  // Get player scores
  cron.schedule(
    "0 * * * 0,4,5,6",
    async function () {
      try {
        await addCurrentTournament(db, async (currentTournamentId) => {
          await addPlayerScores(
            db,
            currentTournamentId,
            (playerScoresAdded) => {
              calculateBestBallScores(
                db,
                currentTournamentId,
                (bestBallUpdated) => {}
              );
            }
          );
        });
      } catch (error) {
        console.log("Error updating player scores: " + error);
      }
    },
    {}
  );

  // Get players in tournament and update rankings
  cron.schedule(
    "0 7,19 * * 1,2,3",
    async function () {
      try {
        await addCurrentTournament(db, async (currentTournamentId) => {
          await addPlayersInTournament(
            db,
            currentTournamentId,
            async (playersAdded) => {
              await addPlayerRankings(db, (playerRankingsAdded) => {});
            }
          );
        });
      } catch (error) {
        console.log("Error getting players and rankings: " + error);
      }
    },
    {}
  );
}

startServer();
