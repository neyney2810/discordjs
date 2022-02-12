const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription('Buy me a coffee'),
    aliases: ['dnt'],

    async execute(interaction) {
        await interaction.reply(`Buy me a coffee ☕`);    },
};