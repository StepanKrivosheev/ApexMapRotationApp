const dotenv = require('dotenv');

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const getMapInfo = require('./getMapInfo');
const getMapInfoR = require('./getMapInfoRanked');

dotenv.config();
botToken = process.env.BOT_TOKEN;

const discordChannels = process.env.DISCORD_CHANNELS;
const channelsArray = discordChannels.split(',');

let mapTimeC = '0';
let mapTimeR = '0';
let rankedInfo = '0';

module.exports = async function bot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
    ],
  });
  client.login(botToken);

  async function updateNickname(nickname, info, rankedInfo) {
    //sets description on discord to map info and status to 'do not disturb'
    // await client.user.setActivity(info, { type: 'PLAYING' });
    // await client.user.setStatus('dnd');

    client.user.setPresence({
      status: 'dnd',
      activities: [
        {
          type: ActivityType.Custom,
          name: info,
        },
      ],
    });

    client.channels.cache.get(channelsArray[0]).send('-setnick ' + nickname);
    client.on('messageCreate', async (message) => {
      if (message.content.startsWith('-setnick')) {
        await message.member.setNickname(nickname);
        //await client.user.setAvatar()
        await message.channel.bulkDelete(1);
        await channelsArray.forEach((element) => {
          client.channels.cache.get(element).setTopic('RANKED MAP: ' + rankedInfo);
        });
      }
    });
  }

  await client.on('ready', async () => {
    let mapInfo = await getMapInfo();

    mapTimeC = mapInfo.mapTimeC;
    mapTimeR = mapInfo.mapTimeR;
    let rankedInfo = mapInfo.nicknameR + mapInfo.infoR;

    updateNickname(mapInfo.nicknameC, mapInfo.infoC, rankedInfo);
  });

  client.on('messageCreate', async (message) => {
    if (message.content.match('/update')) {
      await client.channels.cache.get(message.channelId).send('Updating....');
      await message.delete(message);

      //gets Map info from 'apexlaegendsstatus.com'
      let mapInfo = await getMapInfo();
      mapTimeC = mapInfo.mapTimeC;

      rankedInfo = mapInfo.nicknameR + mapInfo.infoR;

      updateNickname(mapInfoC.nicknameC, mapInfoC.infoC, rankedInfo);
    }

    if (message.content.startsWith('-delete')) {
      let x = 0;
      x = message.toString().slice(8);
      await message.channel.bulkDelete(x);
    }
  });

  //checks the time every minute

  setInterval(async () => {
    time = Date(Date.now()).toString();
    time = time.slice(16, 18) + ':' + time.slice(19, 21);

    //starts if maptime = time
    if (time === '19:00') {
      let mapInfo = await getMapInfo();
      mapTimeC = mapInfo.mapTimeC;
      rankedInfo = mapInfo.nicknameR + mapInfo.infoR;
      updateNickname(mapInfo.nicknameC, mapInfo.infoC, rankedInfo);
    }
    if (time === mapTimeC) {
      //gets Map info from 'apexlaegendsstatus.com'
      let mapInfo = await getMapInfo();
      mapTimeC = mapInfo.mapTimeC;
      rankedInfo = mapInfo.nicknameR + mapInfo.infoR;

      updateNickname(mapInfo.nicknameC, mapInfo.infoC, rankedInfo);
    }
  }, 60 /*sec*/ * 1000 /*millisec*/);
};
