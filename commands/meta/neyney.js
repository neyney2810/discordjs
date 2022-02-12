const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('neyney')
        .setDescription('Replies with NeyNey\'s info!'),
    async execute(interaction) {
        await interaction.reply(`Server name: ${interaction.guild.name} \nTotal members: ${interaction.guild.memberCount}`);    },
};