const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop current audio player'),
    async execute(interaction) {
        await interaction.reply('Stop');
    },
};