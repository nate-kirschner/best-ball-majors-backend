function getLeaderboardsFromCurrentTournament(db, params, callback) {
  const currentTournamentId = params.currentTournamentId;
  db.query(
    "select * from leaderboard where tournament_id = ?",
    [currentTournamentId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getLeaderboardForGivenPlayersInTournament(db, params, callback) {
  const { tournamentId, player1Id, player2Id, player3Id, player4Id } = params;
  db.query(
    "select * from leaderboard where tournament_id = ? and (player_id = ? or player_id = ? or player_id = ? or player_id = ?)",
    [tournamentId, player1Id, player2Id, player3Id, player4Id],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function addLeaderboardRow(db, params, callback) {
  const {
    tournamentId,
    playerId,
    position,
    toPar,
    round1,
    round2,
    round3,
    round4,
    total,
  } = params;
  db.query(
    "insert into leaderboard (tournament_id, player_id, position, to_par, round_1, round_2, round_3, round_4, total) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      tournamentId,
      playerId,
      position,
      toPar,
      round1,
      round2,
      round3,
      round4,
      total,
    ],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getLeaderboardRowByPlayerId(db, params, callback) {
  const { playerId, tournamentId } = params;
  db.query(
    "select * from leaderboard where player_id = ? and tournament_id = ?",
    [playerId, tournamentId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function updateLeaderboard(db, params, callback) {
  const {
    tournamentId,
    playerId,
    position,
    toPar,
    round1,
    round2,
    round3,
    round4,
    total,
  } = params;
  db.query(
    "update leaderboard set position = ?, to_par = ?, round_1 = ?, round_2 = ?, round_3 = ?, round_4 = ?, total = ? where tournament_id = ? and player_id = ?",
    [
      position,
      toPar,
      round1,
      round2,
      round3,
      round4,
      total,
      tournamentId,
      playerId,
    ],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

module.exports = {
  getLeaderboardsFromCurrentTournament,
  getLeaderboardForGivenPlayersInTournament,
  addLeaderboardRow,
  getLeaderboardRowByPlayerId,
  updateLeaderboard,
};
