const playersDAO = require("../dao/playersDAO");
const getPlayerRankings = require("../automation/getPlayerRankings");

async function addPlayerRankings(db, callback) {
  await playersDAO.getAllPlayers(db, async (allPlayers) => {
    const playerRankings = await getPlayerRankings(allPlayers);
    const playerIds = Object.keys(playerRankings);
    for (let i = 0; i < playerIds.length; i++) {
      playersDAO.updateRankings(
        db,
        {
          playerId: playerIds[i],
          rank: playerRankings[playerIds[i]],
        },
        (result) => {}
      );
    }
  });
  callback({ status: 200 });
}

module.exports = addPlayerRankings;
