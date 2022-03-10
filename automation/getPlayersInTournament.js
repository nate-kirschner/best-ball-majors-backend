const puppeteer = require("puppeteer");

async function getPlayersInTournament() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://espn.com/golf/leaderboard");

  // Get the table headers for the competitors table
  await page.waitForSelector(".competitors .Table__THEAD th");
  const tableHeader = await page.$$(".competitors .Table__THEAD th");

  // Before a tournament starts the headers should be | caret | name | tee |
  // If it isn't this, should return out of this method
  if (tableHeader.length !== 3) {
    console.log("Tournament has either already started or hasn't begun");
    return;
  }

  // Get the column number of the player name column
  let nameColumn = -1;
  for (let i = 0; i < tableHeader.length; i++) {
    const classname = await tableHeader[i].getProperty("className");
    const classnameString = await classname.jsonValue();
    if (classnameString.split(" ").includes("name")) {
      nameColumn = i;
    }
  }

  // Get all of the player names in the tournament
  let playerNameList = [];
  await page.waitForSelector(".competitors .Table__TBODY td");
  const playerRows = await page.$$(".competitors .Table__TBODY tr");
  for (let i = 0; i < playerRows.length; i++) {
    const playerData = await playerRows[i].$$("td");
    const playerCol = await playerData[nameColumn];
    if (playerCol) {
      const playerName = await playerCol.evaluate((el) => el.textContent);
      playerNameList.push(playerName);
    }
  }

  await browser.close();

  return playerNameList;
}

module.exports = getPlayersInTournament;
