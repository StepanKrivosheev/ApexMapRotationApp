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
  let nextMap = times[1].substring(12, times[1].indexOf(','));
  let infoC = ` till ${times[0].slice(14)} -> ${nextMap}`;
  let nicknameC = maps[1];
  let mapTimeC = infoC.slice(6, 10) + infoC.slice(10, 12);
  await browser.close();
  let infoR = ` -> ${times[3].substring(12, times[3].indexOf(','))}`;
  let nicknameR = maps[3];
  let mapTimeR = infoR.slice(7, 9) + infoR.slice(10, 12);
  let nextRankedMap = times[3].substring(12, times[3].indexOf(','));
  let nextMaps = [nicknameC, nicknameR, nextMap, nextRankedMap];

  for (e in [nicknameC, nicknameR, nextMap, nextRankedMap]) {
    if (e === 'Kings Canyon') e = e.concat('👑');
    else if (e === 'Olympus') e = e.concat('🏛️');
    else if (e === 'Worlds Edge') e = e.concat('❄️');
    else if (e === 'Storm Point') e = e.concat('🦀');
    else if (e === 'Broken Moon') e = e.concat('☄️');
  }

  nicknameC.concat;
  return { infoC, nicknameC, mapTimeC, infoR, nicknameR, mapTimeR };
};
