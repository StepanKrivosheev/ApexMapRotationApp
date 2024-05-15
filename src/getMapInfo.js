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

  let curentMap = maps[1];
  let nextMap = times[1].substring(12, times[1].indexOf(','));
  let curentRankedMap = maps[3];
  let nextRankedMap = times[3].substring(12, times[3].indexOf(','));
  let avatar = '';

  if (curentMap === 'Kings Canyon')
    avatar =
      'https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/2/2d/Transition_Kings_Canyon_MU4.png/revision/latest/scale-to-width-down/1000?cb=20220819124519';
  else if (curentMap === 'Olympus')
    avatar =
      'https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/3/31/Transition_Olympus_MU1.png/revision/latest/scale-to-width-down/1000?cb=20210504214336';
  else if (curentMap === "World's Edge")
    avatar =
      'https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/a/a0/Transition_World%27s_Edge_MU2.png/revision/latest/scale-to-width-down/1000?cb=20200819134346';
  else if (curentMap === 'Storm Point')
    avatar =
      'https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/2/29/Transition_Storm_Point_MU1.png/revision/latest?cb=20220511221733';
  else if (curentMap === 'Broken Moon')
    avatar =
      'https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/6/6d/Broken_Moon_Eternal_Gardens_Concept_Art.jpg/revision/latest?cb=20230130230609';

  let nextMaps = [curentMap, curentRankedMap, nextMap, nextRankedMap].map((e) => {
    if (e === 'Kings Canyon') return (e = e + '👑');
    else if (e === 'Olympus') return (e = e + '🏛️');
    else if (e === "World's Edge") return (e = e + '❄️');
    else if (e === 'Storm Point') return (e = e + '🦀');
    else if (e === 'Broken Moon') return (e = e + '☄️');
  });

  curentMap = nextMaps[0];
  curentRankedMap = nextMaps[1];
  nextMap = nextMaps[2];
  nextRankedMap = nextMaps[3];

  let infoC = ` till ${times[0].slice(14)} -> ${nextMap}`;
  let mapTimeC = infoC.slice(6, 10) + infoC.slice(10, 11);
  let infoR = `${curentRankedMap} -> ${nextRankedMap}`;
  let mapTimeR = infoR.slice(7, 9) + infoR.slice(10, 12);

  return { infoC, curentMap, mapTimeC, infoR, mapTimeR, avatar };
};
