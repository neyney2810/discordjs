const { MessageEmbed } = require("discord.js");

module.exports = { checkAudioCommandPermission, checkPlayerRunning, noMusicEmbed }

function checkAudioCommandPermission(interaction) {
    if (!interaction.member.voice.channelId) return false;
    if (interaction.guild.me.voice.channelId && 
        interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) 
        return false;
    return true;
}

function checkPlayerRunning(interaction) {
    let player = interaction.client.player;
    if (!player) return false;

    const queue = player.getQueue(interaction.guild);
    if (!queue) return false;
    return true;
}

function noMusicEmbed() {
    return new MessageEmbed()
        .setColor('DARK_AQUA')
        .setDescription('There are no more tracks')
}

