const tournamentsDAO = require("../dao/tournamentsDAO");
const leaderboardDAO = require("../dao/leaderboardDAO");
const playersDAO = require("../dao/playersDAO");
const scorecardsDAO = require("../dao/scorecardsDAO");

function getAllHomePageInfo(db, callback) {
  getCurrentTournament(db, (currentTournament) => {
    getCurrentTournamentScorecards(db, (scorecardsData) => {
      // const sortedData = scorecardsData.sort((first, second) => {
      //   const firstNum = parseInt(first.position);
      //   const secondNum = parseInt(second.position);
      //   if (!!firstNum && !secondNum) {
      //     return 1;
      //   } else if (!firstNum && !!secondNum) {
      //     return -1;
      //   } else if (!!firstNum && !!secondNum && firstNum > secondNum) {
      //     return 1;
      //   } else {
      //     return -1;
      //   }
      // });
      const sortedData = scorecardsData.sort((a, b) => {
        if (a.position.match(/\d+/g) == null) {
          if (b.position.match(/\d+/g) == null) {
            return a.total > b.total ? 1 : -1;
          } else {
            return 1;
          }
        } else if (b.position.match(/\d+/g) == null) {
          if (a.position.match(/\d+/g) == null) {
            return a.total > b.total ? 1 : -1;
          } else {
            return -1;
          }
        } else {
          return Number(a.position.match(/\d+/g)[0]) >
            Number(b.position.match(/\d+/g)[0])
            ? 1
            : -1;
        }
      });
      const result = {
        currentTournament,
        data: sortedData,
      };
      callback(result);
    });
  });
}

function getCurrentTournament(db, callback) {
  tournamentsDAO.getAllTournament(db, (allTournaments) => {
    const currentTournament = allTournaments.reduce((prev, current) =>
      prev.id > current.id ? prev : current
    );
    callback(currentTournament);
  });
}

function getCurrentTournamentLeaderboard(db, callback) {
  getCurrentTournament(db, (currentTournament) => {
    const params = {
      currentTournamentId: currentTournament.id,
    };
    leaderboardDAO.getLeaderboardsFromCurrentTournament(
      db,
      params,
      (leaderboard) => {
        callback(leaderboard);
      }
    );
  });
}

// Will be used for create roster page
function getCurrentTournamentPlayers(db, callback) {
  getCurrentTournamentLeaderboard(db, (leaderboard) => {
    let players = [];
    leaderboard.forEach((leaderboardItem, index) => {
      const playerId = leaderboardItem.player_id;
      playersDAO.getPlayerFromId(db, { playerId }, (playerInfo) => {
        players = [...players, ...playerInfo];
        if (index === leaderboard.length - 1) {
          callback(players);
        }
      });
    });
  });
}

function getCurrentTournamentScorecards(db, callback) {
  getCurrentTournamentLeaderboard(db, (leaderboard) => {
    let tournamentId = leaderboard[0].tournament_id;
    scorecardsDAO.getAllScorecardsFromTournament(
      db,
      { tournamentId },
      (scorecards) => {
        const allPlayerIds = leaderboard.map((item) => item.player_id);
        playersDAO.getAllGivenPlayers(db, { allPlayerIds }, (players) => {
          const allCards = joinCards(leaderboard, scorecards, players);
          callback(allCards);
        });
      }
    );
  });
}

function joinCards(leaderboardArray, scorecardsArray, playersArray) {
  return leaderboardArray
    .map((leaderboardItem) => {
      const scorecardItem = scorecardsArray.find(
        (item) =>
          item.player_id === leaderboardItem.player_id &&
          item.tournament_id === leaderboardItem.tournament_id
      );
      if (!scorecardItem) {
        return -1;
      }
      const playerItem = playersArray.find(
        (item) => item.id === leaderboardItem.player_id
      );
      return {
        tournamentId: leaderboardItem.tournament_id,
        playerId: leaderboardItem.player_id,
        position: leaderboardItem.position,
        toPar: leaderboardItem.to_par,
        round1Score: leaderboardItem.round_1,
        round2Score: leaderboardItem.round_2,
        round3Score: leaderboardItem.round_3,
        round4Score: leaderboardItem.round_4,
        totalScore: leaderboardItem.total,
        parId: scorecardItem.par_id,
        round1Id: scorecardItem.round_1_id,
        round2Id: scorecardItem.round_2_id,
        round3Id: scorecardItem.round_3_id,
        round4Id: scorecardItem.round_4_id,
        playerName: playerItem.player_name,
      };
    })
    .filter((item) => item !== -1);
}

// player object
// {
//   player Id,
//   player Name,
//   tournament Id
//   tournament Name
//   to par
//   position
//   round 1 score
//   round 2 score
//   round 3 score
//   round 4 score
//   par Id
//   round 1 id
//   round 2 id
//   round 3 id
//   round 4 id
// }

module.exports = {
  getCurrentTournament,
  getCurrentTournamentPlayers,
  getCurrentTournamentLeaderboard,
  getCurrentTournamentScorecards,
  getAllHomePageInfo,
};
