const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current track (if available)'),
    aliases: ['next' ] ,
    async execute(interaction) {
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "Can not do this command!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) 
            return await interaction.reply({ content: "Can not loop as no player is active!", ephemeral: true });

        const queue = interaction.client.player.getQueue(interaction.guild);

        const currentTrack = queue.nowPlaying();
        if (queue.skip()) return await interaction.reply(` 👌 | Skip **${currentTrack.title}**! `);

        return await interaction.reply(` No track to skip! `);
    },
    
    handleMessage(message) {
        this.execute(message);
    },
};