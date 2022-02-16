const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = { 
    checkAudioCommandPermission, 
    checkPlayerRunning, 
    noMusicEmbed,
    checkValidChannel }

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

async function checkValidChannel(url) {
    // if (typeof url == "string") return false;

    // if (url.indexOf("open.spotify.com/show/") > 0) {
    //     //Get show id
    //     console

    //     const { data } = await axios.get()
    //     return true;
    // }

    // if (url.indexOf("youtube.com/c") > 0) {
    //     return true;
    // }

    return false;

}
