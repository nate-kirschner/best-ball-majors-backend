const getPlayerScores = require("../automation/getPlayerScores");
const leaderboardDAO = require("../dao/leaderboardDAO");
const playersDAO = require("../dao/playersDAO");
const scorecardsDAO = require("../dao/scorecardsDAO");

async function addPlayerScores(db, currentTournamentId, callback) {
  const playerScores = await getPlayerScores();

  for (let i = 0; i < playerScores.length; i++) {
    const player = playerScores[i];
    addNewPlayerToPlayersTable(db, player.player, (playerId) => {
      addOrUpdateLeaderboardTable(
        db,
        currentTournamentId,
        playerId,
        player,
        (leaderboard) => {
          addOrUpdateRoundsTable(
            db,
            currentTournamentId,
            playerId,
            player.scorecard,
            callback
          );
        }
      );
    });
  }
}

function addNewPlayerToPlayersTable(db, playerName, callback) {
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

function addOrUpdateLeaderboardTable(
  db,
  currentTournamentId,
  playerId,
  playerData,
  callback
) {
  leaderboardDAO.getLeaderboardRowByPlayerId(
    db,
    { tournamentId: currentTournamentId, playerId },
    (leaderboardRow) => {
      const params = {
        tournamentId: currentTournamentId,
        playerId,
        position: playerData.position,
        toPar: playerData.score,
        round1: isNaN(Number(playerData.round1))
          ? null
          : Number(playerData.round1),
        round2: isNaN(Number(playerData.round2))
          ? null
          : Number(playerData.round2),
        round3: isNaN(Number(playerData.round3))
          ? null
          : Number(playerData.round3),
        round4: isNaN(Number(playerData.round4))
          ? null
          : Number(playerData.round4),
        total: isNaN(Number(playerData.total))
          ? null
          : Number(playerData.total),
      };
      if (leaderboardRow.length === 0) {
        leaderboardDAO.addLeaderboardRow(db, params, (result) => {
          callback(result);
        });
      } else {
        leaderboardDAO.updateLeaderboard(db, params, (result) => {
          callback(result);
        });
      }
    }
  );
}

function addOrUpdateRoundsTable(
  db,
  tournamentId,
  playerId,
  roundsData,
  callback
) {
  const roundsDataKeys = Object.keys(roundsData);
  for (let roundNum = 0; roundNum < roundsDataKeys.length; roundNum++) {
    scorecardsDAO.getRoundFromId(
      db,
      { tournamentId, playerId, roundNum },
      (round) => {
        const params = {
          tournamentId,
          playerId,
          roundNum,
          allHoles: Object.values(roundsData[roundNum]).map((val) =>
            isNaN(Number(val)) ? null : Number(val)
          ),
        };
        if (round.length === 0) {
          scorecardsDAO.addRound(db, params, (result) => {});
        } else {
          scorecardsDAO.updateRound(db, params, (result) => {});
        }
      }
    );
  }
  callback({ status: 200 });
}

module.exports = addPlayerScores;
