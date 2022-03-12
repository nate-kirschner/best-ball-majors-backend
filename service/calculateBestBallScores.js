const rostersDAO = require("../dao/rostersDAO");
const scorecardsDAO = require("../dao/scorecardsDAO");
const scorecardsService = require("./scorecardService");

async function calculateBestBallScores(db, currentTournamentId, callback) {
  rostersDAO.getRostersForTournament(
    db,
    { tournamentId: currentTournamentId },
    (rosters) => {
      rosters.map((roster) => {
        const rosterId = roster.id;
        const player1Id = roster.player_1_id;
        const player2Id = roster.player_2_id;
        const player3Id = roster.player_3_id;
        const player4Id = roster.player_4_id;
        let params = {
          tournamentId: currentTournamentId,
          player1Id,
          player2Id,
          player3Id,
          player4Id,
        };
        scorecardsDAO.getRoundsForFourPlayers(db, params, (scorecards) => {
          scorecardsDAO.getParFromTournament(
            db,
            { tournamentId: currentTournamentId },
            (par) => {
              let scores = {};
              scorecards.map((card) => {
                if (scores[card.player_id]) {
                  scores[card.player_id] = {
                    ...scores[card.player_id],
                    [card.round_number]: card,
                  };
                } else {
                  scores[card.player_id] = { [card.round_number]: card };
                }
              });
              params = {
                par: par[0],
                scores,
              };
              scorecardsService.calculateBestBallScores(
                db,
                params,
                (bestBallScores) => {
                  const bestBallTotals = sumScores(bestBallScores);
                  params = {
                    rosterId,
                    bestBallRound1: bestBallTotals[1],
                    bestBallRound2: bestBallTotals[2],
                    bestBallRound3: bestBallTotals[3],
                    bestBallRound4: bestBallTotals[4],
                    bestBallTotal:
                      bestBallTotals[1] +
                      bestBallTotals[2] +
                      bestBallTotals[3] +
                      bestBallTotals[4],
                  };
                  rostersDAO.updateBestBallTotal(db, params, (result) => {
                    callback({ status: 200 });
                  });
                }
              );
            }
          );
        });
      });
    }
  );
}

function sumScores(bestBallScores) {
  let sums = {};
  Object.keys(bestBallScores).map((round) => {
    sums[round] = 0;
    const roundScores = bestBallScores[round];
    Object.keys(roundScores).map((hole) => {
      sums[round] = sums[round] + roundScores[hole];
    });
  });
  return sums;
}

module.exports = calculateBestBallScores;
