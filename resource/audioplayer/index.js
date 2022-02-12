const { Player } = require('discord-player');

module.exports.createDiscordPlayer = (client) => {


    player.on('trackStart', (queue, track) => {
        queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`);
    });

    player.on('trackAdd', (queue, track) => {
        queue.metadata.channel.send(` ✔ | Added **${track.title}**!`);
    })

    player.on('tracksAdd', (queue, tracks) => {

    })


    return player;
}