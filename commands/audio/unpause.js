const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unpause')
        .setDescription('Continue playing song!')
    ,

    async execute(interaction) {
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "You have not joined a channel or I'm playing in another channel!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) 
            return await interaction.reply({ content: "Can not unpause as no player is active!", ephemeral: true });

        const queue = interaction.client.player.getQueue(interaction.guild);
        queue.setPaused(false);

        return await interaction.reply(` 👌 | Continue playing! `);
    },

    handleMessage(message) {
        this.execute(message);
    },
};