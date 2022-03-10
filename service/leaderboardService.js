const tournamentsDAO = require("../dao/tournamentsDAO");

function getAllTournaments(db, callback) {
  tournamentsDAO.getAllTournament(db, (tournaments) => {
    callback(tournaments);
  });
}

module.exports = {
  getAllTournaments,
};
