const dotenv = require('dotenv');

const {
	Client,
	GatewayIntentBits,
	ActivityType,
	MessageCollector,
	CategoryChannel,
} = require('discord.js');
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
		const apexChannels = {};
		let mapInfo = await getMapInfo();
		mapTimeC = mapInfo.mapTimeC;
		guilds = await client.guilds.fetch();
		guildIDs = guilds.map((guild) => guild.id);
		texChannels = {};

    
		let channelsArray = guildIDs.map(async (guildID) => {
			(await client.guilds.cache.get(guildID).channels.fetch()).toJSON();
		});

		console.log(channelsArray);

		//texChannels.push(channels.find((channel) => channel.type == 0));

		//console.log(texChannels.find((channel) => channel.topic.includes('Apex')));

		// apexChannels.push(
		// 	texChannels.find((channel) => channel.topic.includes('Apex'))
		// );

		// await client.channels.cache
		// 	.get(texChannels[0].id)
		// 	.members.get(client.user.id)
		// 	.setNickname(mapInfo.curentMap);
		// //console.log(apexChannels);
		// apexChannels.forEach((element) => {
		// 	console.log(element.id);
		// 	client.channels.cache
		// 		.get(element.id)
		// 		.setTopic(
		// 			'R.M.: ' +
		// 				mapInfo.infoR +
		// 				'\n\n\n\nprovided by: Apex LegendsMapBot\nby KrivS'
		// 		);
		// });

		// client.user.setPresence({
		// 	status: 'dnd',
		// 	activities: [
		// 		{
		// 			type: ActivityType.Custom,
		// 			name: mapInfo.infoC,
		// 		},
		// 	],
		// });

		// if (timeOut <= 0) {
		// 	await client.user.setAvatar(mapInfo.avatar);
		// 	await client.user.setBanner(mapInfo.avatar);
		// }
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
	}, 60 /*sec*/ * 1000 /*millisec*/);
};
