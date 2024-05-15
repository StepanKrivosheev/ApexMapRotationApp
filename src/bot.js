const dotenv = require('dotenv');

const { Client, GatewayIntentBits, ActivityType, MessageCollector } = require('discord.js');
const getMapInfo = require('./getMapInfo');

dotenv.config();
botToken = process.env.BOT_TOKEN;

const discordChannels = process.env.DISCORD_CHANNELS;
const channelsArray = discordChannels.split(',');

let mapTimeC = '0';
let timeOut = '15';

module.exports = async function bot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.MessageContent,
    ],
  });
  client.login(botToken);

  async function updateNickname() {
    let mapInfo = await getMapInfo();
    mapTimeC = mapInfo.mapTimeC;

    client.user.setPresence({
      status: 'dnd',
      activities: [
        {
          type: ActivityType.Custom,
          name: mapInfo.infoC,
        },
      ],
    });
    client.channels.cache
      .get(channelsArray[0])
      .members.get(client.user.id)
      .setNickname(mapInfo.curentMap);

    if (timeOut <= 0) {
      await client.user.setAvatar(mapInfo.avatar);
      await client.user.setBanner(mapInfo.avatar);
    }

    await channelsArray.forEach((element) => {
      client.channels.cache.get(element).setTopic('R.M.: ' + mapInfo.infoR);
    });
  }

  await client.on('ready', async () => {
    updateNickname();
  });

  await client.on('messageCreate', async (message) => {
    if (message.content.match('/update')) {
      await client.channels.cache.get(message.channelId).send('Updating....');
      await updateNickname();
      await message.channel.bulkDelete(2);
    }

    if (message.content.startsWith('/delete')) {
      let x = 0;
      x = message.toString().slice(8, 10);
      await message.channel.bulkDelete(x);
    }
  });

  //checks the time every minute

  setInterval(async () => {
    timeOut--;
    time = Date(Date.now()).toString();
    time = time.slice(16, 18) + ':' + time.slice(19, 21);

    //starts if maptime = time
    if (time === '19:00') {
      await updateNickname();
    }
    if (time === mapTimeC) {
      await updateNickname();
    }
  }, 10 /*sec*/ * 1000 /*millisec*/);
};
