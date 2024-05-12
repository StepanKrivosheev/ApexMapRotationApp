const dotenv = require("dotenv");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const time = require("./time");

module.exports = async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://apexlegendsstatus.com/current-map/battle_royale/pubs"
  );

  const maps = await page.$$eval(".row h3", (maps) => {
    return maps.map((x) => x.textContent);
  });

  const times = await page.$$eval(".row p", (times) => {
    return times
      .map((x) => x.textContent.slice(11, 19).replace(/to/, "till "))
      .slice(1, 12);
  });

  await browser.close();
  let info = ` ${times[0]} -> ${maps[1]}`;
  let nickname = maps[0];

  return { info, nickname };
};
