const getCurrentTournament = require("../automation/getCurrentTournament");
const tournamentsDAO = require("../dao/tournamentsDAO");

// returns current tournament id
async function addCurrentTournament(db, callback) {
  const currentTournamentName = await getCurrentTournament();
  checkIfTournamentExists(db, currentTournamentName, (result) => {
    if (result.exists) {
      callback(result.tournament[0].id);
      return;
    } else {
      tournamentsDAO.addCurrentTournament(
        db,
        { tournamentName: currentTournamentName, year: 2022 },
        (result) => {
          callback(result.insertId);
        }
      );
    }
  });
}

function checkIfTournamentExists(db, tournamentName, callback) {
  tournamentsDAO.getTournamentFromName(
    db,
    { tournamentName },
    (tournamentsResult) => {
      if (tournamentsResult.length === 0) {
        callback({ exists: false });
      } else {
        callback({ exists: true, tournament: tournamentsResult });
      }
    }
  );
}

module.exports = addCurrentTournament;
