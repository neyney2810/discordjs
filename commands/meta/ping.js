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
			await i.deferUpdate();
			await i.editReply({ content: `Ping: ${interaction.client.ws.ping}`, components: [row] });
			await wait(15 * 1000);
			await i.editReply({ content: `Ping: ${interaction.client.ws.ping}`, components: [] });
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));

	},

	handleMessage(message) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Ping')
					.setStyle('PRIMARY')
			);

		message.channel.send({ content: `Ping: ${message.client.ws.ping}ms`, components: [row], ephemeral: true })

		const filter = i => i.customId === 'primary';
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60 * 1000 });
        collector.on('collect', async i => {
			message.channel.send({ content: `Ping: ${message.client.ws.ping}ms`, ephemeral: true });
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};