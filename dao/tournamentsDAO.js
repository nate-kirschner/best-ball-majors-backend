function getAllTournament(db, callback) {
  db.query("select * from tournaments", (err, result) => {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

function getTournamentFromId(db, params, callback) {
  const tournamentId = params.tournamentId;
  db.query(
    "select * from tournaments where id = ?",
    [tournamentId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getTournamentFromName(db, params, callback) {
  const { tournamentName } = params;
  db.query(
    "select * from tournaments where tournament_name = ?",
    [tournamentName],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function addCurrentTournament(db, params, callback) {
  const { tournamentName, year } = params;
  db.query(
    "insert into tournaments (tournament_name, year) values (?, ?)",
    [tournamentName, year],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

module.exports = {
  getAllTournament,
  getTournamentFromId,
  getTournamentFromName,
  addCurrentTournament,
};
