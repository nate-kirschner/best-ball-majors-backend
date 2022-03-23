const leaguesDAO = require("../dao/leaguesDAO");
const userDAO = require("../dao/userDAO");
const rostersDAO = require("../dao/rostersDAO");
const homeService = require("./homeService");

function getUsersLeagues(db, params, callback) {
  try {
    const { username } = params;
    userDAO.getUserFromUsername(db, { username }, (userInfo) => {
      const userId = userInfo[0].id;
      leaguesDAO.getLeaguesFromUserId(db, { userId }, (leagues) => {
        const leagueIdList = leagues.map((league) => league.league_id);
        leaguesDAO.getLeaguesFromGivenLeagueIds(
          db,
          { leagueIdList },
          (leagueNames) => {
            callback(leagueNames);
          }
        );
      });
    });
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

function getLeagueInfo(db, params, callback) {
  try {
    const { leagueId, leagueName, leagueTournamentIds } = params;
    leaguesDAO.getLeagueMembersForLeagueId(
      db,
      { leagueId },
      (leagueMembers) => {
        const userIdList = leagueMembers.map((mem) => mem.user_id);
        rostersDAO.getRostersForUserListAndRosterList(
          db,
          { userIdList, tournamentIdList: leagueTournamentIds, leagueId },
          (rosters) => {
            userDAO.getUserFromUserIdList(
              db,
              { usersList: userIdList },
              (users) => {
                const data = users.map((user) => {
                  const userRosters = rosters.filter(
                    (roster) => roster.user_id === user.id
                  );
                  return {
                    userId: user.id,
                    username: user.username,
                    rosters: userRosters,
                  };
                });
                callback(data);
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

function createNewLeague(db, params, callback) {
  try {
    const { username, newLeagueName } = params;
    leaguesDAO.checkIfLeagueExists(db, { newLeagueName }, (existingLeagues) => {
      if (existingLeagues.length === 0) {
        leaguesDAO.createNewLeague(db, { newLeagueName }, (result) => {
          joinLeague(
            db,
            { username, leagueName: newLeagueName },
            (joinResult) => {
              callback({ success: 200 });
            }
          );
        });
      } else {
        callback({ success: 400 });
      }
    });
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

function joinLeague(db, params, callback) {
  try {
    const { username, leagueName } = params;
    userDAO.getUserFromUsername(db, { username }, (userInfo) => {
      const userId = userInfo[0].id;
      leaguesDAO.getLeagueIdFromLeagueName(db, { leagueName }, (leagueInfo) => {
        const leagueId = leagueInfo[0].id;
        leaguesDAO.joinLeague(db, { userId, leagueId }, (result) => {
          callback({ success: 200 });
        });
      });
    });
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

function getLeaguesWithoutUser(db, params, callback) {
  try {
    const { username } = params;
    userDAO.getUserFromUsername(db, { username }, (userInfo) => {
      const userId = userInfo[0].id;
      leaguesDAO.getLeaguesFromUserId(db, { userId }, (usersLeagues) => {
        const leagueIds = usersLeagues.map((l) => l.league_id);
        leaguesDAO.getLeaguesNotInList(db, { leagueIds }, (leagues) => {
          callback(leagues);
        });
      });
    });
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

function getLeagueName(db, params, callback) {
  try {
    const { leagueName } = params;
    leaguesDAO.getLeagueIdFromLeagueName(db, { leagueName }, (result) => {
      callback(result);
    });
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

function getAvailableLeaguesForNewRoster(db, params, callback) {
  try {
    const { username } = params;
    userDAO.getUserFromUsername(db, { username }, (userInfo) => {
      const userId = userInfo[0].id;
      homeService.getCurrentTournament(db, (currentTournament) => {
        const tournamentId = currentTournament.id;
        rostersDAO.getRosterFromUserIdAndTournamentId(
          db,
          { userId, tournamentId },
          (usersRosters) => {
            const rosterIds = usersRosters.map((roster) => roster.id);
            leaguesDAO.getLeaguesFromRosterIdList(
              db,
              { rosterIds },
              (leagues) => {
                const leagueIds = leagues.map((league) => league.league_id);
                leaguesDAO.getLeaguesNotInList(
                  db,
                  { leagueIds },
                  (leaguesList) => {
                    callback(leaguesList);
                  }
                );
              }
            );
          }
        );
      });
    });
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

module.exports = {
  getUsersLeagues,
  getLeagueInfo,
  createNewLeague,
  joinLeague,
  getLeaguesWithoutUser,
  getLeagueName,
  getAvailableLeaguesForNewRoster,
};
