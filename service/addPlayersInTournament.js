const getPlayersInTournament = require("../automation/getPlayersInTournament");
const playersDAO = require("../dao/playersDAO");
const leaderboardDAO = require("../dao/leaderboardDAO");
const scorecardsDAO = require("../dao/scorecardsDAO");

async function addPlayersInTournament(db, currentTournamentId, callback) {
  const playersInTournament = await getPlayersInTournament();

  addNewPlayersToPlayersTable(db, playersInTournament, (playerId) => {
    // next add to leaderboard table
    addNewPlayerToLeaderboardTable(
      db,
      currentTournamentId,
      playerId,
      (result) => {
        addRoundsForNewPlayer(db, currentTournamentId, playerId, (result2) => {
          addScorecardForNewPlayer(
            db,
            currentTournamentId,
            playerId,
            (result3) => {}
          );
        });
      }
    );
  });
}

function addNewPlayersToPlayersTable(db, playersInTournament, callback) {
  for (let i = 0; i < playersInTournament.length; i++) {
    const playerName = playersInTournament[i];
    playersDAO.getPlayerByName(db, { playerName }, (player) => {
      let playerId;
      if (player.length === 0) {
        // insert into player table
        playersDAO.addPlayer(
          db,
          { playerName, playerRank: -1 },
          (playerAdded) => {
            playerId = playerAdded.insertId;
            callback(playerId);
          }
        );
      } else {
        playerId = player[0].id;
        callback(playerId);
      }
    });
  }
}

function addNewPlayerToLeaderboardTable(
  db,
  currentTournamentId,
  playerId,
  callback
) {
  leaderboardDAO.getLeaderboardRowByPlayerId(
    db,
    { tournamentId: currentTournamentId, playerId },
    (leaderboardRow) => {
      if (leaderboardRow.length === 0) {
        const params = {
          tournamentId: currentTournamentId,
          playerId,
          position: "",
          toPar: "",
          round1: null,
          round2: null,
          round3: null,
          rount4: null,
          total: null,
        };
        leaderboardDAO.addLeaderboardRow(db, params, (result) => {
          callback(result);
        });
      } else {
        callback({ status: 200 });
      }
    }
  );
}

function addRoundsForNewPlayer(db, tournamentId, playerId, callback) {
  for (let roundNum = 0; roundNum < 5; roundNum++) {
    scorecardsDAO.getRoundFromId(
      db,
      { tournamentId, playerId, roundNum },
      (round) => {
        if (round.length === 0) {
          const params = {
            tournamentId,
            playerId,
            roundNum,
            allHoles: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
          };
          scorecardsDAO.addRound(db, params, (result) => {});
        } else {
          callback({ status: 200 });
        }
      }
    );
  }
}

function addScorecardForNewPlayer(db, tournamentId, playerId, callback) {
  console.log("adding scorecard");
  scorecardsDAO.getAllRoundIdsForPlayerAndTournament(
    db,
    { tournamentId, playerId },
    (rounds) => {
      const parId = rounds.find((round) => round.round_number === 0).id;
      const round1Id = rounds.find((round) => round.round_number === 1).id;
      const round2Id = rounds.find((round) => round.round_number === 2).id;
      const round3Id = rounds.find((round) => round.round_number === 3).id;
      const round4Id = rounds.find((round) => round.round_number === 4).id;
      const params = {
        playerId,
        tournamentId,
        parId,
        round1Id,
        round2Id,
        round3Id,
        round4Id,
      };
      scorecardsDAO.getScorecard(db, params, (scorecard) => {
        if (scorecard.length === 0) {
          console.log("scorecard doesn't exist");
          scorecardsDAO.addScorecard(db, params, (result) => {
            callback(result);
          });
        } else {
          console.log("scorecard exists");
          callback({ status: 200 });
        }
      });
    }
  );
}

module.exports = addPlayersInTournament;
