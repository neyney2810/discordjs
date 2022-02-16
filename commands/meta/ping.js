const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js')

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
		await interaction.reply({ content: `Ping: ${interaction.client.ws.ping} ms`, components: [row], ephemeral: true })
	},

	handleMessage(message) {
		this.execute(message);
	},
};

