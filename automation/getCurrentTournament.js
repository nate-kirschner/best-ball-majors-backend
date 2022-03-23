const puppeteer = require("puppeteer");
const config = require("../config");

async function getCurrentTournament() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(config.espnLink);

  await page.waitForSelector(
    ".headline.headline__h1.Leaderboard__Event__Title"
  );

  const tournamentHeader = await page.$(
    ".headline.headline__h1.Leaderboard__Event__Title"
  );

  const tournamentName = await tournamentHeader.evaluate(
    (el) => el.textContent
  );

  await browser.close();

  return tournamentName;
}

module.exports = getCurrentTournament;
