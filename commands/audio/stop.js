const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop current audio player'),
    async execute(interaction) {
        
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "Can not do this command!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) 
            return await interaction.reply({ content: "Can not loop as no player is running!", ephemeral: true });

        const queue = interaction.client.player.getQueue(interaction.guild);
        queue.stop();

        return await interaction.reply(` 👌 | Player stop! `);
    },
    
    handleMessage(message) {
        this.execute(message);
    },
};