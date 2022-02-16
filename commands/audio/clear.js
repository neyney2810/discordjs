const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear this queue'),
    async execute(interaction) {
        
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "Can not do this command!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) 
            return await interaction.reply({ content: "Can not clear as no player is running!", ephemeral: true });

        const queue = interaction.client.player.getQueue(interaction.guild);
        queue.clear();

        return await interaction.reply(` 👌 | Queue clear! `);
    },

    handleMessage(message) {
        this.execute(message);
    },
};