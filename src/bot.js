const dotenv = require("dotenv");

const {
  Client,
  Intents,
  ShardClientUtil,
  Activity,
  Presence,
} = require("discord.js");
const getMapInfo = require("./getMapInfo");
dotenv.config();

mapTime = "0";

module.exports = async function bot() {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_PRESENCES,
    ],
  });
  client.login(process.env.DSICORDJS_BOT_TOKEN);
  prefix = "-";

  await client.on("ready", async () => {
    //gets Map info from 'apexlaegendsstatus.com'
    let mapInfo = await getMapInfo();

    mapTime = mapInfo.info.slice(7, 9) + mapInfo.info.slice(10, 12);
    map = mapInfo.nickname;

    haltDieText = client.channels.cache.get(haltDieText);

    //sets description on discord to map info and status to 'do not disturb'
    await client.user.setActivity(mapInfo.info, { type: "PLAYING" });
    await client.user.setStatus("dnd");

    //sends command to self and sets own nickname to currenr map
    await haltDieText.send("@silent " + prefix + "setnick " + mapInfo.nickname);
    await client.on("messageCreate", async (message) => {
      if (message.content.startsWith(prefix + "setnick")) {
        //message.content.slice(("setnick").length);
        await message.member.setNickname(map);
        setTimeout(() => message.delete(), 100);
      }
    });
  });

  //checks the time every minute
  setInterval(async () => {
    time = Date(Date.now()).toString();
    time = time.slice(16, 18) + time.slice(19, 21);

    //starts code at half/full houre
    if (time === mapTime) {
      //gets Map info from 'apexlaegendsstatus.com'
      let mapInfo = await getMapInfo();

      //sets description on discord to map info
      client.user.setActivity(mapInfo.info, { type: "PLAYING" });

      //sends command to self and sets own nickname to currenr map
      haltDieText.send("@silent " + prefix + "setnick " + mapInfo.nickname);

      client.on("messageCreate", async (message) => {
        if (message.content.startsWith(prefix + "setnick")) {
          //message.content.slice(("setnick").length);
          message.member.setNickname(mapInfo.nickname);
          setTimeout(() => message.delete(), 100);
        }
      });
    }
  }, 60 * 1000);
};
