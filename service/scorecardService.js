const scorecardDAO = require("../dao/scorecardsDAO");

function getScorecardInfo(db, params, callback) {
  try {
    scorecardDAO.getRoundsFromIds(db, params, (scorecards) => {
      callback(scorecards);
    });
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

// function takes an object of player objects which have scorecards for each round and a par scorecard
// scores: { player1: { 1: { hole_1: _, ... }, 2: {}, 3: {}, 4: {} }, player2: { ... } }
// par: { hole_1: _, ... }
function calculateBestBallScores(db, params, callback) {
  try {
    const { par, scores } = params;
    const bestBallScores = {};
    for (let round = 1; round <= 4; round++) {
      const holeByHoleScores = {};
      Object.keys(scores).map((player) => {
        const playerRound = scores[player][round];
        if (playerRound) {
          for (let hole = 1; hole <= 18; hole++) {
            const holeStr = "hole_" + hole;
            if (holeByHoleScores[holeStr]) {
              if (playerRound[holeStr] < holeByHoleScores[holeStr]) {
                holeByHoleScores[holeStr] = playerRound[holeStr];
              }
            } else {
              holeByHoleScores[holeStr] = playerRound[holeStr];
            }
          }
        }
      });
      bestBallScores[round] = holeByHoleScores;
    }
    const scoresSubtractedFromPar = subtractScoresFromPar(db, {
      bestBall: bestBallScores,
      par,
    });
    callback(scoresSubtractedFromPar);
  } catch (error) {
    console.log(error);
    callback({ status: 400 });
  }
}

function subtractScoresFromPar(db, params) {
  try {
    const { bestBall, par } = params;
    const scores = {};
    Object.keys(bestBall).map((round) => {
      const roundScores = bestBall[round];
      scores[round] = {};
      for (let hole = 1; hole <= 18; hole++) {
        const holeStr = "hole_" + hole;
        if (roundScores[holeStr] === null) {
          roundScores[holeStr] = par[holeStr];
          scores[round][holeStr] = roundScores[holeStr] - par[holeStr];
        } else {
          scores[round][holeStr] = roundScores[holeStr] - par[holeStr];
        }
      }
    });
    return scores;
  } catch (error) {
    console.log(error);
    return { status: 400 };
  }
}

module.exports = {
  getScorecardInfo,
  calculateBestBallScores,
};
