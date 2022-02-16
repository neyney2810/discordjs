module.exports = {
    label: "ping",

    async execute(interaction) {
        interaction.deferUpdate();
		return await interaction.message.edit({ content: `Ping: ${interaction.client.ws.ping} ms` })
    }
};