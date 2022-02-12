const { SlashCommandBuilder } = require('@discordjs/builders');

const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prev')
        .setDescription('Jump to previous track'),
    aliases: ['next' ] ,
    async execute(interaction) {
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "Can not do this command!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) 
            return await interaction.reply({ content: "Can not loop as no player is active!", ephemeral: true });

        const queue = interaction.client.player.getQueue(interaction.guild);
        interaction.deferReply();
        await interaction.followUp(` 👌`);
        queue.back();
        return;
    },
};