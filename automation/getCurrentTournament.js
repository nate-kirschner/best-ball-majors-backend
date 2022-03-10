const puppeteer = require("puppeteer");

async function getCurrentTournament() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://espn.com/golf/leaderboard");

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
