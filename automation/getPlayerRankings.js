const puppeteer = require("puppeteer");

async function getPlayerRankings(allPlayers) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    "http://www.owgr.com/Ranking.aspx?pageNo=1&pageSize=All&country=All"
  );
  const playerIdToRankings = {};
  for (let i = 4; i < allPlayers.length; i++) {
    const player = allPlayers[i];
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let playerName = player.player_name;
    letters.split("").forEach((l) => {
      if (player.player_name.includes(` (${l})`)) {
        playerName = player.player_name.split(` (${l})`)[0];
      }
    });
    playerName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    try {
      const xpath = `//a[contains(text(), \"${playerName}\")]/parent::td/parent::tr/child::td`;
      // await page.waitForXPath(xpath);
      const playerRankTd = await page.$x(xpath);
      const rank = await playerRankTd[0].evaluate((el) => el.textContent);
      playerIdToRankings[Number(player.id)] = isNaN(Number(rank))
        ? null
        : Number(rank);
    } catch (error) {
      console.log(
        "Unable to get ranking for " + player.player_name + ": " + error
      );
    }
  }

  await browser.close();

  return playerIdToRankings;
}

module.exports = getPlayerRankings;
