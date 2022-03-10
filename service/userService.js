const userDAO = require("../dao/userDAO");

let bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function signup(db, params, callback) {
  const { username, email, password } = params;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    const params = { username, email, password: hash };
    userDAO.checkIfUserExists(db, params, (existingUsers) => {
      if (existingUsers.length === 0) {
        // username is not taken
        userDAO.createUser(db, params, (createdUser) => {
          callback({
            success: 200,
            message: "User created!",
          });
        });
      } else {
        callback({
          success: 400,
          message: "Username is already taken",
        });
      }
    });
  });
}

function login(db, params, callback) {
  const { username, password } = params;

  userDAO.checkIfUserExists(db, params, (user) => {
    if (user === null || user.length === 0) {
      callback({
        success: 400,
      });
      return;
    }
    bcrypt.compare(password, user[0].password, (err, result) => {
      if (err) {
        throw err;
      }
      if (result === true) {
        let token = jwt.sign(
          { username: user[0].username },
          "best ball majors super secret sentence",
          { expiresIn: 129600 }
        );
        callback({
          success: 200,
          err: null,
          token,
        });
      } else {
        callback({
          success: 400,
          token: null,
          err: "Username and password do not match",
        });
      }
    });
  });
}

module.exports = {
  signup,
  login,
};
