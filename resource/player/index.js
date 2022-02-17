const { Player } = require('discord-player');

module.exports.createNewPlayer = (interaction) => {

    let player = new Player(interaction.client, { filter: "audioonly" });

    player.on('trackStart', (queue, track) => {
        interaction.channel.send({ content: `🎶 | Now playing **${track.title}** !` })
    })

    player.on('connectionError', (queue, error) => {
        queue.play( undefined, {leaveOnEmptyCooldown : 5*60*1000});
    })

    player.on('error', (queue, error) => {
        queue.play( undefined, {leaveOnEmptyCooldown : 5*60*1000});
    })

    interaction.client.player = player;
    return player;
}