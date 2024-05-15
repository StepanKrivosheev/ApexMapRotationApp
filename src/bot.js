const dotenv = require('dotenv');

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const getMapInfo = require('./getMapInfo');

dotenv.config();
botToken = process.env.BOT_TOKEN;

const discordChannels = process.env.DISCORD_CHANNELS;
const channelsArray = discordChannels.split(',');

let mapTimeC = '0';
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

	async function updateNickname() {
		//sets description on discord to map info and status to 'do not disturb'
		// await client.user.setActivity(info, { type: 'PLAYING' });
		// await client.user.setStatus('dnd');

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
			.send('-setnick ' + mapInfo.curentMap);
		client.on('messageCreate', async (message) => {
			if (message.content.startsWith('-setnick')) {
        
				await message.member.setNickname(mapInfo.curentMap);
				//await message.member.roles.color.setColor('DarkGreen');
				await client.user.setAvatar(mapInfo.avatar);
				await message.channel.bulkDelete(1);
				await channelsArray.forEach((element) => {
					client.channels.cache
						.get(element)
						.setTopic('R.M.: ' + mapInfo.infoR);
				});
			}
		});
	}

	await client.on('ready', async () => {
		updateNickname();
	});

	client.on('messageCreate', async (message) => {
		if (message.content.match('/update')) {

			await client.channels.cache.get(message.channelId).send('Updating....');
			await message.delete(message);
			
			updateNickname();
		}

		if (message.content.startsWith('-delete')) {
      console.log(message.content);
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

      updateNickname();
		}
		if (time === mapTimeC) {
		
			updateNickname();
		}
	}, 60 /*sec*/ * 1000 /*millisec*/);
};
