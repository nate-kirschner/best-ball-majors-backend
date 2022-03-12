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

function getUserFromEmail(db, params, callback) {
  const { email } = params;
  db.query("select * from users where email = ?", [email], (err, result) => {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

function userHasExistingPasswordResetRequestToken(db, params, callback) {
  const { userId } = params;
  db.query(
    "select * from passwordResetMapping where user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function deletePasswordResetRequestToken(db, params, callback) {
  const { mappingId } = params;
  db.query(
    "delete from passwordResetMapping where id = ?",
    [mappingId],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function createPasswordResetRequestToken(db, params, callback) {
  const { userId, token } = params;
  db.query(
    "insert into passwordResetMapping (user_id, reset_token) values (?, ?)",
    [userId, token],
    (err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    }
  );
}

function updatePassword(db, params, callback) {
  const { userId, newPassword } = params;
  db.query(
    "update users set password = ? where id = ?",
    [newPassword, userId],
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
  getUserFromEmail,
  userHasExistingPasswordResetRequestToken,
  deletePasswordResetRequestToken,
  createPasswordResetRequestToken,
  updatePassword,
};
