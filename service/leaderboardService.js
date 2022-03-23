const tournamentsDAO = require("../dao/tournamentsDAO");

function getAllTournaments(db, callback) {
  try {
    tournamentsDAO.getAllTournament(db, (tournaments) => {
      callback(tournaments);
    });
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

module.exports = {
  getAllTournaments,
};
