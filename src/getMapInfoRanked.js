const puppeteer = require('puppeteer');

module.exports = async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.goto('https://apexlegendsstatus.com/current-map');

  const maps = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h2'), (e) => e.innerText)
  );

  const times = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h5'), (e) => e.innerText)
  );

  await browser.close();
  let infoR = ` -> ${times[3].substring(12, times[3].indexOf(','))}`;
  let nicknameR = maps[3];
  let mapTimeR = infoR.slice(7, 9) + infoR.slice(10, 12);
  return { infoR, nicknameR, mapTimeR };
};
