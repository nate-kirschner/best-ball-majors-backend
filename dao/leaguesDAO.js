function getLeaguesFromRosterId(db, params, callback) {
  const { rosterId } = params;
  db.query(
    "select * from leaguerosters where roster_id = ?",
    [rosterId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getLeaguesFromGivenLeagueIds(db, params, callback) {
  const { leagueIdList } = params;
  let queryString = "select * from leagues where id = ?";
  const idString = " or id = ?";
  for (let i = 0; i < leagueIdList.length - 1; i++) {
    queryString += idString;
  }
  db.query(queryString, leagueIdList, (err, result) => {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

function getLeaguesFromUserId(db, params, callback) {
  const { userId } = params;
  db.query(
    "select * from leaguemembers where user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getLeagueMembersForLeagueId(db, params, callback) {
  const { leagueId } = params;
  db.query(
    "select * from leaguemembers where league_id = ?",
    [leagueId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

// used for creating a new roster
function addRosterToLeagues(db, params, callback) {
  const { leagueId, rosterId } = params;
  db.query(
    "insert into leaguerosters (roster_id, league_id) values (?, ?)",
    [rosterId, leagueId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function checkIfLeagueExists(db, params, callback) {
  const { newLeagueName } = params;
  db.query(
    "select * from leagues where league_name = ?",
    [newLeagueName],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function createNewLeague(db, params, callback) {
  const { newLeagueName } = params;
  db.query(
    `insert into leagues (league_name) values ('${newLeagueName}')`,
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function joinLeague(db, params, callback) {
  const { leagueId, userId } = params;
  db.query(
    `insert into leaguemembers (user_id, league_id) values (${userId}, ${leagueId})`,
    (err, result) => {
      if (err) {
        throw onerror;
      }
      callback(result);
    }
  );
}

function getLeagueIdFromLeagueName(db, params, callback) {
  const { leagueName } = params;
  db.query(
    `select * from leagues where league_name = '${leagueName}'`,
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getLeaguesNotInList(db, params, callback) {
  const { leagueIds } = params;
  let queryString = "";
  if (leagueIds.length > 0) {
    queryString = `where id not in (${leagueIds})`;
  }
  db.query(`select * from leagues ` + queryString, (err, result) => {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

function getLeaguesFromRosterIdList(db, params, callback) {
  const { rosterIds } = params;
  if (rosterIds.length > 0) {
    db.query(
      "select * from leaguerosters where roster_id in (?)",
      [rosterIds],
      (err, result) => {
        if (err) {
          throw err;
        }
        callback(result);
      }
    );
  } else {
    callback([]);
  }
}

module.exports = {
  getLeaguesFromRosterId,
  getLeaguesFromGivenLeagueIds,
  getLeaguesFromUserId,
  addRosterToLeagues,
  getLeagueMembersForLeagueId,
  checkIfLeagueExists,
  createNewLeague,
  joinLeague,
  getLeagueIdFromLeagueName,
  getLeaguesNotInList,
  getLeaguesFromRosterIdList,
};
