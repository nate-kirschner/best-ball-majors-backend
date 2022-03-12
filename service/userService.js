const userDAO = require("../dao/userDAO");

let bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const nodemailer = require("nodemailer");
let crypto = require("crypto");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

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

function resetPasswordRequest(db, params, callback) {
  const { email } = params;
  userDAO.getUserFromEmail(db, params, (users) => {
    if (users.length !== 1) {
      callback({ status: 400 });
    } else {
      const userId = users[0].id;
      const username = users[0].username;
      userDAO.userHasExistingPasswordResetRequestToken(
        db,
        { userId },
        async (userToken) => {
          if (userToken.length !== 0) {
            const existingToken = userToken[0].id;
            userDAO.deletePasswordResetRequestToken(
              db,
              { mappingId: existingToken },
              async (deletedToken) => {
                await addNewToken(
                  db,
                  userId,
                  username,
                  email,
                  (tokenAddedStatus) => {
                    callback(tokenAddedStatus);
                  }
                );
              }
            );
          } else {
            await addNewToken(
              db,
              userId,
              username,
              email,
              (tokenAddedStatus) => {
                callback(tokenAddedStatus);
              }
            );
          }
        }
      );
    }
  });
}

async function addNewToken(db, userId, username, email, callback) {
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);
  userDAO.createPasswordResetRequestToken(
    db,
    { userId, token: hash },
    (createdMapping) => {
      const link = `${config.domain}/passwordReset?token=${resetToken}&id=${userId}`;
      const emailSent = sendEmail(username, userId, email, resetToken);
      if (emailSent === 200) {
        callback({ status: 200 });
      } else {
        callback({ status: 400 });
      }
    }
  );
  callback({ status: 200 });
}

function sendEmail(username, userId, email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.user,
      pass: config.user.pass,
    },
  });

  const link = `http://${config.domain}/passwordReset?token=${token}&id=${userId}`;
  const mailOptions = {
    from: "nmkirschner@gmail.com",
    to: `${email}`,
    subject: "Best Ball Majors Password Reset Request",
    html:
      `<p>Hi ${username},</p>` +
      "<p>You requested to reset your password.</p>" +
      "<p>Please, click the link below to reset your password</p>" +
      `<a href=${link}>Reset Password</a>` +
      "<p>If this was not you, please ignore this email.</p>",
  };

  try {
    transporter.sendMail(mailOptions);
    return 200;
  } catch (err) {
    console.log("Error sending email " + err);
  }
}

function resetPassword(db, params, callback) {
  const { userId, token, newPassword } = params;
  userDAO.userHasExistingPasswordResetRequestToken(
    db,
    { userId },
    async (resetTokenRow) => {
      if (resetTokenRow.length === 0) {
        callback({ status: 400 });
      } else {
        const isValid = await bcrypt.compare(
          token,
          resetTokenRow[0].reset_token
        );
        if (!isValid) {
          callback({ status: 400 });
        } else {
          const passwordHash = await bcrypt.hash(newPassword, 10);
          userDAO.updatePassword(
            db,
            { userId, newPassword: passwordHash },
            (passwordUpdated) => {
              userDAO.deletePasswordResetRequestToken(
                db,
                { mappingId: resetTokenRow[0].id },
                (rowDeleted) => {
                  callback({ status: 200 });
                }
              );
            }
          );
        }
      }
    }
  );
}

module.exports = {
  signup,
  login,
  resetPasswordRequest,
  resetPassword,
};
