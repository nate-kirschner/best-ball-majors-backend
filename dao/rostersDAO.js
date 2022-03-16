function getRostersFromUserId(db, params, callback) {
  const userId = params.userId;
  db.query(
    "select * from rosters where user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function createNewRoster(db, params, callback) {
  const {
    rosterName,
    tournamentId,
    userId,
    player1Id,
    player2Id,
    player3Id,
    player4Id,
  } = params;
  db.query(
    "insert into rosters (roster_name, tournament_id, user_id, player_1_id, player_2_id, player_3_id, player_4_id) values (?, ?, ?, ?, ?, ?, ?)",
    [
      rosterName,
      tournamentId,
      userId,
      player1Id,
      player2Id,
      player3Id,
      player4Id,
    ],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getRostersForUserListAndRosterList(db, params, callback) {
  const { userIdList, tournamentIdList, leagueId } = params;
  db.query(
    `select user_id, bestball_total, tournament_id from rosters join leaguerosters on leaguerosters.roster_id = rosters.id where user_id in (${userIdList}) and tournament_id in (${tournamentIdList}) and leaguerosters.league_id = ${leagueId}`,
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getRostersForTournament(db, params, callback) {
  const { tournamentId } = params;
  db.query(
    "select * from rosters where tournament_id = ?",
    [tournamentId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function updateBestBallTotal(db, params, callback) {
  const {
    rosterId,
    bestBallRound1,
    bestBallRound2,
    bestBallRound3,
    bestBallRound4,
    bestBallTotal,
  } = params;
  db.query(
    `update rosters set bestBallRound1 = ?, bestBallRound2 = ?, bestBallRound3 = ?, bestBallRound4 = ?, bestball_total = ? where id = ?`,
    [
      bestBallRound1,
      bestBallRound2,
      bestBallRound3,
      bestBallRound4,
      bestBallTotal,
      rosterId,
    ],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function deleteRoster(db, params, callback) {
  const { rosterId } = params;
  db.query("delete from rosters where id = ?", [rosterId], (err, result) => {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

function deleteRosterFromLeagues(db, params, callback) {
  const { rosterId } = params;
  db.query(
    "delete from leaguerosters where roster_id = ?",
    [rosterId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getRosterFromRosterId(db, params, callback) {
  const { rosterId } = params;
  db.query("select * from rosters where id = ?", [rosterId], (err, result) => {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

function updateRoster(db, params, callback) {
  const {
    rosterId,
    rosterName,
    tournamentId,
    userId,
    player1Id,
    player2Id,
    player3Id,
    player4Id,
  } = params;
  db.query(
    "update rosters set roster_name = ?, tournament_id = ?, user_id = ?, player_1_id = ?, player_2_id = ?, player_3_id = ?, player_4_id = ? where id = ?",
    [
      rosterName,
      tournamentId,
      userId,
      player1Id,
      player2Id,
      player3Id,
      player4Id,
      rosterId,
    ],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getRosterFromUserIdAndTournamentId(db, params, callback) {
  const { userId, tournamentId } = params;
  db.query(
    "select * from rosters where user_id = ? and tournament_id = ?",
    [userId, tournamentId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

module.exports = {
  getRostersFromUserId,
  createNewRoster,
  getRostersForUserListAndRosterList,
  getRostersForTournament,
  updateBestBallTotal,
  deleteRoster,
  deleteRosterFromLeagues,
  getRosterFromRosterId,
  updateRoster,
  getRosterFromUserIdAndTournamentId,
};
