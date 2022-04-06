function getAllScorecardsFromTournament(db, params, callback) {
  const tournamentId = params.tournamentId;
  db.query(
    "select * from scorecards where tournament_id = ?",
    [tournamentId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getRoundsFromIds(db, params, callback) {
  const parId = params.parId;
  const round1Id = params.round1Id;
  const round2Id = params.round2Id;
  const round3Id = params.round3Id;
  const round4Id = params.round4Id;

  db.query(
    "select * from rounds where id = ? or id = ? or id = ? or id = ? or id = ?",
    [parId, round1Id, round2Id, round3Id, round4Id],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getRoundsForFourPlayers(db, params, callback) {
  const { tournamentId, player1Id, player2Id, player3Id, player4Id } = params;
  db.query(
    "select * from rounds where " +
      "tournament_id = ? and " +
      "(round_number = 1 or round_number = 2 or round_number = 3 or round_number = 4) and " +
      "(player_id = ? or player_id = ? or player_id = ? or player_id = ?)",
    [tournamentId, player1Id, player2Id, player3Id, player4Id],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getParFromTournament(db, params, callback) {
  const { tournamentId } = params;
  db.query(
    "select * from rounds where tournament_id = ? and round_number = 0 limit 1",
    [tournamentId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getRoundFromId(db, params, callback) {
  const { roundNum, tournamentId, playerId } = params;
  db.query(
    "select * from rounds where tournament_id = ? and player_id = ? and round_number = ?",
    [tournamentId, playerId, roundNum],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function addRound(db, params, callback) {
  const { playerId, tournamentId, roundNum, allHoles } = params;
  let holesArr = [];
  let questionmarkArr = [];
  allHoles.forEach((hole, index) => {
    holesArr.push("hole_" + (index + 1));
    questionmarkArr.push("?");
  });
  const holesStr = holesArr.join(", ");
  const questionmarkString = questionmarkArr.join(", ");
  db.query(
    `insert into rounds (player_id, tournament_id, round_number, ${holesStr}) values (?, ?, ?, ${questionmarkString})`,
    [playerId, tournamentId, roundNum, ...allHoles],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function updateRound(db, params, callback) {
  const { playerId, tournamentId, roundNum, allHoles } = params;
  let holesArr = [];
  allHoles.forEach((hole, index) => {
    holesArr.push("hole_" + (index + 1) + " = ?");
  });
  const holesStr = holesArr.join(", ");
  db.query(
    `update rounds set ${holesStr} where tournament_id = ? and player_id = ? and round_number = ?`,
    [...allHoles, tournamentId, playerId, roundNum],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getScorecard(db, params, callback) {
  const {
    playerId,
    tournamentId,
    parId,
    round1Id,
    round2Id,
    round3Id,
    round4Id,
  } = params;
  db.query(
    `select * from scorecards where player_id = ? and tournament_id = ? and par_id = ? and round_1_id = ? and round_2_id = ? and round_3_id = ? and round_4_id = ?`,
    [playerId, tournamentId, parId, round1Id, round2Id, round3Id, round4Id],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function addScorecard(db, params, callback) {
  const {
    playerId,
    tournamentId,
    parId,
    round1Id,
    round2Id,
    round3Id,
    round4Id,
  } = params;
  db.query(
    "insert into scorecards (player_id, tournament_id, par_id, round_1_id, round_2_id, round_3_id, round_4_id) values (?, ?, ?, ?, ?, ?, ?)",
    [playerId, tournamentId, parId, round1Id, round2Id, round3Id, round4Id],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getAllRoundIdsForPlayerAndTournament(db, params, callback) {
  const { tournamentId, playerId } = params;
  db.query(
    `select * from rounds where player_id = ? and tournament_id = ? and round_number in (0, 1, 2, 3, 4)`,
    [playerId, tournamentId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getAllRoundsForTournament(db, params, callback) {
  const { tournamentId } = params;
  db.query(
    "select * from rounds where tournament_id = ?",
    [tournamentId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

module.exports = {
  getAllScorecardsFromTournament,
  getRoundsFromIds,
  getRoundsForFourPlayers,
  getParFromTournament,
  getRoundFromId,
  addRound,
  getAllRoundIdsForPlayerAndTournament,
  getScorecard,
  addScorecard,
  updateRound,
  getAllRoundsForTournament,
};
