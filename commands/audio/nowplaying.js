const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { checkAudioCommandPermission, noMusicEmbed, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show the current track'),
    aliases: ['current' ] ,
    async execute(interaction) {
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "Can not do this command!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) 
            return await interaction.reply({ content: "Can not loop as no player is active!", ephemeral: true });

        const queue = interaction.client.player.getQueue(interaction.guild);

        const currentTrack = queue.nowPlaying();
        if (!currentTrack) 
            return await interaction.reply({ embeds: [ noMusicEmbed() ], ephemeral: true });
            
        const progressBar = queue.createProgressBar({ 
            timecodes: true, 
            length: currentTrack.duration, 
        });
        const messageEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`🎶 | Now playing: **${currentTrack.title}** \n ${progressBar}`)
        return await interaction.reply({ embeds: [messageEmbed], ephemeral: true });
    },

    
    handleMessage(message) {
        this.execute(message);
    },
};