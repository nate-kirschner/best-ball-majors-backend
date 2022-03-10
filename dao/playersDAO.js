function getPlayerFromId(db, params, callback) {
  const playerId = params.playerId;
  db.query("select * from players where id = ?", [playerId], (err, result) => {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

function getAllGivenPlayers(db, params, callback) {
  const allPlayerIds = params.allPlayerIds;
  let queryString = "select * from players where id = ?";
  const idString = " or id = ?";
  for (let i = 0; i < allPlayerIds.length - 1; i++) {
    queryString += idString;
  }
  db.query(queryString, allPlayerIds, (err, result) => {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

function getPlayerByName(db, params, callback) {
  const { playerName } = params;
  db.query(
    "select * from players where player_name = ?",
    [playerName],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function addPlayer(db, params, callback) {
  const { playerName, playerRank } = params;
  db.query(
    "insert into players (player_rank, player_name) values (?, ?)",
    [playerRank, playerName],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getAllPlayers(db, callback) {
  db.query("select * from players", (err, result) => {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

function updateRankings(db, params, callback) {
  const { playerId, rank } = params;
  db.query(
    "update players set player_rank = ? where id = ?",
    [rank, playerId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

module.exports = {
  getPlayerFromId,
  getAllGivenPlayers,
  getPlayerByName,
  addPlayer,
  getAllPlayers,
  updateRankings,
};
