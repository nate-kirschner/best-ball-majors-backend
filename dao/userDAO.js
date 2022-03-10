function checkIfUserExists(db, params, callback) {
  const username = params.username;
  db.query(
    "select * from users where username = ?",
    [username],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function createUser(db, params, callback) {
  const { email, username, password } = params;
  db.query(
    "insert into users (email, username, password) values (?, ?, ?)",
    [email, username, password],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getUserFromUsername(db, params, callback) {
  const username = params.username;
  db.query(
    "select * from users where username = ?",
    [username],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function getUserFromUserIdList(db, params, callback) {
  const usersList = params.usersList;
  let queryString = "id = ?";
  for (let i = 0; i < usersList.length - 1; i++) {
    queryString += " or id = ?";
  }
  db.query(
    "select * from users where " + queryString,
    usersList,
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

module.exports = {
  checkIfUserExists,
  createUser,
  getUserFromUsername,
  getUserFromUserIdList,
};
