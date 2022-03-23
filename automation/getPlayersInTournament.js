const puppeteer = require("puppeteer");
const config = require("../config");

async function getPlayersInTournament() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(config.espnLink);

  // Get the table headers for the competitors table
  await page.waitForSelector(".competitors .Table__THEAD th");
  const tableHeader = await page.$$(".competitors .Table__THEAD th");

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
