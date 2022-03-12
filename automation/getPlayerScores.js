const puppeteer = require("puppeteer");
const getPlayersInTournament = require("../automation/getPlayersInTournament");

async function getPlayerScores() {
  let playersInTournament = await getPlayersInTournament();

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://espn.com/golf/leaderboard");

  // Get the table headers for the competitors table
  await page.waitForSelector(".competitors .Table__THEAD th");
  const tableHeader = await page.$$(".competitors .Table__THEAD th");

  // Before a tournament starts the headers should be | caret | name | tee |
  // If it isn't this, should return out of this method
  if (tableHeader.length === 3) {
    console.log("Tournament hasn't begun, no scores columns");
    return;
  }

  const columnIndices = {};
  for (let i = 0; i < tableHeader.length; i++) {
    const header = tableHeader[i];
    const headerName = await header.evaluate((el) => el.textContent);
    switch (headerName) {
      case "POS":
        columnIndices.position = i;
        break;
      case "PLAYER":
        columnIndices.player = i;
        break;
      case "SCORE":
        columnIndices.score = i;
        break;
      case "R1":
        columnIndices.round1 = i;
        break;
      case "R2":
        columnIndices.round2 = i;
        break;
      case "R3":
        columnIndices.round3 = i;
        break;
      case "R4":
        columnIndices.round4 = i;
        break;
      case "TOT":
        columnIndices.total = i;
        break;
    }
  }

  const allPlayersData = [];
  for (let i = 0; i < playersInTournament.length; i++) {
    let playerName = playersInTournament[i];
    const playerClicked = await clickPlayerLink(page, playerName);
    if (playerClicked === 200) {
      const playerRowData = await getPlayerRow(page, playerName, columnIndices);
      const playerScorecardData = await getPlayerScorecard(page, playerName);
      if (playerScorecardData) {
        allPlayersData.push({
          ...playerRowData,
          scorecard: playerScorecardData,
        });
      }
    }
  }

  await browser.close();

  return allPlayersData;
}

async function clickPlayerLink(page, playerName) {
  const xpath = `//a[contains(text(), \"${playerName}\")]`;
  try {
    await page.waitForXPath(xpath);
    const playerLink = await page.$x(xpath);
    const classname = await playerLink[0].getProperty("className");
    const classnameString = await classname.jsonValue();
    if (!classnameString.split(" ").includes("leaderboard_player_name")) {
      return 400;
    }
    await playerLink[0].click();
    return 200;
  } catch (error) {
    console.log(
      `Error finding and clicking playerName ${playerName}: ` + error
    );
    return 400;
  }
}

async function getPlayerRow(page, playerName, columnIndices) {
  const xpath = `//a[contains(text(), \"${playerName}\")]/parent::td/parent::tr/child::td`;
  const playerRowData = {};
  try {
    await page.waitForXPath(xpath);
    const playerRow = await page.$x(xpath);
    for (let i = 0; i < playerRow.length; i++) {
      const td = await playerRow[i].evaluate((el) => el.textContent);
      Object.keys(columnIndices).forEach((column) => {
        if (columnIndices[column] === i) {
          playerRowData[column] = td;
        }
      });
    }
    return playerRowData;
  } catch (error) {
    console.log(
      `Error finding and clicking playerName ${playerName}: ` + error
    );
  }
}

async function getPlayerScorecard(page, playerName) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  letters.split("").forEach((l) => {
    if (playerName.includes(` (${l})`)) {
      playerName = playerName.split(` (${l})`)[0];
    }
  });
  const xpath = `//a[contains(text(), \"${playerName}\")]/parent::div/parent::div/parent::div/parent::div/parent::div/child::div[@class='Wrapper Leaderboard__Tab__Content__Wrapper']/child::div`;
  try {
    await page.waitForXPath(xpath);
    const scorecardDiv = await page.$x(xpath);
    const xpathForRoundSelect =
      xpath + `/child::div/child::select[@class="dropdown__select"]`;
    await page.waitForXPath(xpathForRoundSelect);
    const roundSelect = await page.$x(xpathForRoundSelect);
    const xpathForRoundOptions = xpathForRoundSelect + `/child::option`;
    await page.waitForXPath(xpathForRoundOptions);
    const roundOptions = await page.$x(xpathForRoundOptions);
    const scorecardData = {};
    for (let i = 0; i < roundOptions.length; i++) {
      const optionValue = await roundOptions[i].evaluate((el) =>
        el.getAttribute("value")
      );
      // await page.select("select." + roundSelectClass, optionValue);
      await roundSelect[0].select(optionValue);
      const { parData, scoreData } = await getRoundScorecard(
        page,
        playerName,
        optionValue
      );
      scorecardData[0] = parData;
      scorecardData[Number(optionValue)] = scoreData;
    }
    return scorecardData;
  } catch (error) {
    console.log("Error getting scorecard for " + playerName + ": " + error);
  }
}

async function getRoundScorecard(page, playerName, roundValue) {
  const xpath = `//a[contains(text(), \"${playerName}\")]/parent::div/parent::div/parent::div/parent::div/parent::div/child::div[@class='Wrapper Leaderboard__Tab__Content__Wrapper']/child::div/child::div[@class="Scorecard relative"]//child::tbody/child::tr`;
  try {
    await page.waitForXPath(xpath);
    const tableRows = await page.$x(xpath);
    const parRow = await tableRows[0];
    const parRowText = await parRow.$$eval("span", (els) =>
      els.map((n) => n.textContent)
    );
    const scoreRow = tableRows[1];
    const scoreRowText = await scoreRow.$$eval("span", (els) =>
      els.map((n) => n.textContent)
    );
    const parData = {};
    let holeNum = 0;
    for (let i = 0; i < parRowText.length; i++) {
      if (i === 0 || i === 10 || i === 20 || i === 21) {
        continue;
      }
      holeNum++;
      parData["hole" + holeNum] = parRowText[i];
    }
    const scoreData = {};
    holeNum = 0;
    for (let i = 0; i < scoreRowText.length; i++) {
      if (i === 0 || i === 10 || i === 20 || i === 21) {
        continue;
      }
      holeNum++;
      scoreData["hole" + holeNum] = scoreRowText[i];
    }
    return { parData, scoreData };
  } catch (error) {
    console.log(
      "Error getting round scorecard for " + playerName + ": " + error
    );
  }
}

module.exports = getPlayerScores;
