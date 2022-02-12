const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js')
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Ping')
					.setStyle('PRIMARY')
			);

		await interaction.reply({ content: `Ping: ${interaction.client.ws.ping}`, components: [row] })

		const filter = i => i.customId === 'primary';

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30 * 1000 });

        collector.on('collect', async i => {
            if (i.customId === 'primary') {
				await i.deferUpdate();
				await i.editReply({ content: `Ping: ${interaction.client.ws.ping}`, components: [row] });
				await wait(15 * 1000);
				await i.editReply({ content: `Ping: ${interaction.client.ws.ping}`, components: [] });
            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));

		// const embed = new MessageEmbed()
		// 		.setColor('#0099ff')
		// 		.setTitle('Title')
		// 		.setURL('https://discord.js.org')
		// 		.setDescription('Some description here')
		// await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] })

	},

	handleMessage(message) {
		message.channel.send(`Ping: ${message.client.ws.ping}ms`);
	},
};