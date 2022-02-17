const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current track (if available)')
        .addIntegerOption(option =>
            option.setName('tracknumber')
                .setDescription("Skip to certain track number")
                .setMinValue(0)
                .setRequired(false)),
    aliases: ['next' ] ,
    async execute(interaction) {
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "Can not do this command!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) 
            return await interaction.reply({ content: "Can not skip as no player is active!", ephemeral: true });

        const queue = interaction.client.player.getQueue(interaction.guild);

        const skipTo = interaction.options.getInteger('tracknumber');
        if (!skipTo) {
            const currentTrack = queue.nowPlaying();
            if (queue.skip()) return await interaction.reply(` 👌 | Skip **${currentTrack.title}**! `);            
        } else {
            if (skipTo < queue.tracks.length) return await interaction.reply(` ❌ | Can not skip to track **${skipTo}! `);
             queue.skipTo(skipTo);
        }



        return await interaction.reply(` No track to skip! `);
    },
    
    async handleMessage(message) {
        const skipTo = message.content.split(' ')[1];

        if (skipTo != "" && isNaN(skipTo)) return;

        if (!checkAudioCommandPermission(message)) 
            return await message.reply({ content: "Can not do this command!", ephemeral: true });

        if (!checkPlayerRunning(message)) 
            return await message.reply({ content: "Can not skip as no player is active!", ephemeral: true });

        const queue = message.client.player.getQueue(message.guild);
        if (!skipTo) {
            const currentTrack = queue.nowPlaying();
            if (queue.skip()) return await message.reply(` 👌 | Skip **${currentTrack.title}**! `);            
        } else {
            if (skipTo < queue.tracks.length) return await message.reply(` ❌ | Can not skip to track **${skipTo}! `);
            queue.skipTo(skipTo);
        }


    },
};