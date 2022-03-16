const userDAO = require("../dao/userDAO");
const rostersDAO = require("../dao/rostersDAO");
const tournamentsDAO = require("../dao/tournamentsDAO");
const playersDAO = require("../dao/playersDAO");
const leaderboardDAO = require("../dao/leaderboardDAO");
const leaguesDAO = require("../dao/leaguesDAO");
const scorecardsDAO = require("../dao/scorecardsDAO");
const homeService = require("../service/homeService");
const scorecardService = require("../service/scorecardService");

// gets list of rosters without going into other databases for specific information
function getInitialRosterInfo(db, params, callback) {
  const { username } = params;
  userDAO.getUserFromUsername(db, { username }, (userInfo) => {
    const userId = userInfo[0].id;
    rostersDAO.getRostersFromUserId(db, { userId }, (rosters) => {
      callback(rosters);
    });
  });
}

function getIndividualRosterData(db, params, callback) {
  const { rosterId, tournamentId, player1Id, player2Id, player3Id, player4Id } =
    params;
  tournamentsDAO.getTournamentFromId(db, { tournamentId }, (tournamentInfo) => {
    const tournamentName = tournamentInfo[0].tournament_name;
    const playerIdList = {
      player1Id: player1Id,
      player2Id: player2Id,
      player3Id: player3Id,
      player4Id: player4Id,
    };
    getPlayerNames(db, playerIdList, (playersInfo) => {
      getLeaderboardForGivenPlayersInTournament(db, params, (leaderboard) => {
        getLeaguesOfRoster(db, { rosterId }, (leagueNames) => {
          const accumulatedRoster = accumulateRosterData(
            tournamentInfo,
            playersInfo,
            leaderboard,
            leagueNames
          );
          callback(accumulatedRoster);
        });
      });
    });
  });
}

function getPlayerNames(db, params, callback) {
  const { player1Id, player2Id, player3Id, player4Id } = params;
  params = { allPlayerIds: [player1Id, player2Id, player3Id, player4Id] };
  playersDAO.getAllGivenPlayers(db, params, (playersInfo) => {
    callback(playersInfo);
  });
}

function getLeaderboardForGivenPlayersInTournament(db, params, callback) {
  leaderboardDAO.getLeaderboardForGivenPlayersInTournament(
    db,
    params,
    (leaderboard) => {
      callback(leaderboard);
    }
  );
}

function getLeaguesOfRoster(db, params, callback) {
  const { rosterId } = params;
  leaguesDAO.getLeaguesFromRosterId(db, { rosterId }, (leagues) => {
    const leagueIdList = leagues.map((league) => league.league_id);
    leaguesDAO.getLeaguesFromGivenLeagueIds(
      db,
      { leagueIdList },
      (leagueNames) => {
        callback(leagueNames);
      }
    );
  });
}

function accumulateRosterData(
  tournamentInfo,
  playerInfo,
  leaderboardInfo,
  leagueInfo
) {
  const player1 = accumulatePlayerData(
    playerInfo[0].id,
    playerInfo,
    leaderboardInfo
  );
  const player2 = accumulatePlayerData(
    playerInfo[1].id,
    playerInfo,
    leaderboardInfo
  );
  const player3 = accumulatePlayerData(
    playerInfo[2].id,
    playerInfo,
    leaderboardInfo
  );
  const player4 = accumulatePlayerData(
    playerInfo[3].id,
    playerInfo,
    leaderboardInfo
  );

  const accumulatedData = {
    tournamentId: tournamentInfo[0].id,
    tournamentName: tournamentInfo[0].tournament_name,
    player1,
    player2,
    player3,
    player4,
    leagues: leagueInfo,
  };

  return accumulatedData;
}

function accumulatePlayerData(playerId, playersInfo, leaderboardInfo) {
  const playerNameInfo = playersInfo.find((player) => player.id === playerId);
  const playerLeaderboard = leaderboardInfo.find(
    (player) => player.player_id === playerId
  );

  let player = {};
  if (playerLeaderboard) {
    player = {
      playerId: playerId,
      playerName: playerNameInfo.player_name,
      position: playerLeaderboard.position,
      toPar: playerLeaderboard.to_par,
      round1: playerLeaderboard.round_1,
      round2: playerLeaderboard.round_2,
      round3: playerLeaderboard.round_3,
      round4: playerLeaderboard.round_4,
      total: playerLeaderboard.total,
    };
  } else {
    player = {
      playerId: playerId,
      playerName: playerNameInfo.player_name,
    };
  }
  return player;
}

function getRosterScorecardData(db, params, callback) {
  const { tournamentId, player1Id, player2Id, player3Id, player4Id } = params;
  scorecardsDAO.getRoundsForFourPlayers(db, params, (playerHoles) => {
    scorecardsDAO.getParFromTournament(db, { tournamentId }, (par) => {
      const parHoles = par[0];
      const player1Holes = playerHoles.filter(
        (player) => player.player_id === player1Id
      );
      const player2Holes = playerHoles.filter(
        (player) => player.player_id === player2Id
      );
      const player3Holes = playerHoles.filter(
        (player) => player.player_id === player3Id
      );
      const player4Holes = playerHoles.filter(
        (player) => player.player_id === player4Id
      );
      const scores = {};
      const players = [player1Holes, player2Holes, player3Holes, player4Holes];
      players.map((playerHoles) => {
        playerHoles.map((playerRound) => {
          if (scores[playerRound.player_id]) {
            scores[playerRound.player_id][playerRound.round_number] =
              playerRound;
          } else {
            scores[playerRound.player_id] = {
              [playerRound.round_number]: playerRound,
            };
          }
        });
      });
      scorecardService.calculateBestBallScores(
        db,
        { scores, par: parHoles },
        (bestBallScores) => {
          callback({
            parHoles,
            player1Holes,
            player2Holes,
            player3Holes,
            player4Holes,
            bestBallScores,
          });
        }
      );
    });
  });
}

function canRostersBeCreated(db, params, callback) {
  homeService.getCurrentTournamentLeaderboard(
    db,
    (currentTournamentLeaderboard) => {
      let canCreate = true;
      currentTournamentLeaderboard.forEach((player) => {
        canCreate =
          canCreate &&
          player.round_1 === null &&
          player.round_2 === null &&
          player.round_3 === null &&
          player.round_4 === null;
      });
      callback({ canRostersBeCreated: canCreate });
    }
  );
}

// used for create roster page
function getCurrentTournamentPlayers(db, callback) {
  homeService.getCurrentTournamentPlayers(db, (result) => {
    const sortedPlayerList = result.sort((a, b) => {
      if (a.player_rank === -1) {
        return 1;
      } else if (b.player_rank === -1) {
        return -1;
      } else if (a.player_rank < b.player_rank) {
        return -1;
      } else {
        return 1;
      }
    });
    const playerPages = {
      1: sortedPlayerList.slice(0, 15),
      2: sortedPlayerList.slice(15, 40),
      3: sortedPlayerList.slice(40, 75),
      4: sortedPlayerList.slice(75),
    };
    callback(playerPages);
  });
}

function createNewRoster(db, params, callback) {
  const {
    rosterId,
    rosterName,
    username,
    player1Id,
    player2Id,
    player3Id,
    player4Id,
    leagueIdList,
  } = params;
  canRostersBeCreated(db, {}, (result) => {
    if (result.canRostersBeCreated) {
      userDAO.getUserFromUsername(db, { username }, (userInfo) => {
        const userId = userInfo[0].id;
        homeService.getCurrentTournament(db, (currentTournament) => {
          const tournamentId = currentTournament.id;
          params = { ...params, userId, tournamentId };
          if (rosterId === -1) {
            rostersDAO.createNewRoster(db, params, (rosterCreated) => {
              const rosterId = rosterCreated.insertId;
              leagueIdList.map((leagueId) => {
                leaguesDAO.addRosterToLeagues(
                  db,
                  { leagueId, rosterId },
                  (result) => {}
                );
              });
              callback({ status: 200 });
            });
          } else {
            rostersDAO.updateRoster(db, params, (rosterUpdated) => {
              rostersDAO.deleteRosterFromLeagues(
                db,
                { rosterId },
                (rosterDeleted) => {}
              );
              leagueIdList.map((leagueId) => {
                leaguesDAO.addRosterToLeagues(
                  db,
                  { leagueId, rosterId },
                  (result) => {}
                );
              });
            });
          }
        });
      });
    } else {
      callback({ status: 400 });
    }
  });
}

function deleteRoster(db, params, callback) {
  const { rosterId, rosterTournamentId } = params;
  canRostersBeCreated(db, {}, (result) => {
    if (result.canRostersBeCreated) {
      homeService.getCurrentTournament(db, (currentTournament) => {
        if (rosterTournamentId === currentTournament.id) {
          rostersDAO.deleteRoster(db, { rosterId }, (rosterDeleted) => {
            rostersDAO.deleteRosterFromLeagues(
              db,
              { rosterId },
              (leaguesDeleted) => {
                callback({ status: 200 });
              }
            );
          });
        } else {
          callback({ status: 400 });
        }
      });
    } else {
      callback({ status: 400 });
    }
  });
}

function getRosterDataFromId(db, params, callback) {
  const { rosterId } = params;
  rostersDAO.getRosterFromRosterId(db, { rosterId }, (roster) => {
    getLeaguesOfRoster(db, { rosterId }, (leagues) => {
      callback({ roster: roster[0], leagues });
    });
  });
}

module.exports = {
  getInitialRosterInfo,
  getIndividualRosterData,
  getRosterScorecardData,
  canRostersBeCreated,
  getCurrentTournamentPlayers,
  createNewRoster,
  deleteRoster,
  getRosterDataFromId,
};
