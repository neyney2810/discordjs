const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('save')
        .setDescription('Save the current playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Playlist name')
                .setRequired(true)),
    async execute(interaction) {
        

        if (!checkAudioCommandPermission(interaction))
            return await interaction.reply({ content: "Can not do this command!", ephemeral: true });

        if (!checkPlayerRunning(interaction))
            return await interaction.reply({ content: "Can not clear as no player is running!", ephemeral: true });

        const mysql = interaction.client.mysql;
        if (!mysql) return await interaction.reply({ content: "Can not create a playlist", ephemeral: true });

        const playlistName = interaction.options.getString('name');

        const userId = interaction.user.id + interaction.guildId;
        const queue = interaction.client.player.getQueue(interaction.guild);


        //Check user => create a user
        await mysql.query(`INSERT IGNORE INTO user(iduser, idguild, iddiscord) VALUES ("${userId}", "${interaction.guildId}", "${interaction.user.id}" )`)
        const [ playlists ] = await mysql.query(`SELECT * FROM music_playlist WHERE iduser = "${userId}" AND name = "${playlistName}"`);

        if (playlists.length == 0) {
            //Create playlist
            const [ newPlaylist ] = await mysql.query(`INSERT INTO music_playlist(iduser, name) VALUES ("${userId}", "${playlistName}")`);

            //Create tracks
            const info = {};
            for (const track of queue.previousTracks.concat(queue.tracks)) {
                info[track.id] = [ track.url, track.title, newPlaylist.insertId ]
            }
            mysql.query(`INSERT INTO track(url, title, idmusic_playlist) VALUES ?`, [Object.values(info)]);
            mysql.query(`UPDATE user SET default_music_playlist = ${newPlaylist.insertId} WHERE iduser = "${userId}" AND default_music_playlist IS NULL`);
            return await interaction.reply(` ✅ | Saved to playlist **${playlistName}**`);
        } else {
            await interaction.reply( { content: ` Playlist is available. Replace it? (Default: not)`});

            const message = await interaction.fetchReply();

            message.react('✅');
            message.react('❌');

            const filter = (reaction, user) => {
                return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === interaction.user.id;
            };
            const collector = message.createReactionCollector({ filter, time: 15000 });

            collector.on('collect', async (reaction) => {
                message.reactions.removeAll();
                if (reaction.emoji.name === '✅') {
                    //DELETE all the current tracks
                    await mysql.query(`DELETE FROM track WHERE idmusic_playlist = ${playlists[0].idmusic_playlist}`);
                    //INSERT all new tracks
                    //Create tracks
                    const info = {};
                    for (const track of queue.previousTracks.concat(queue.tracks)) {
                        info[track.id] = [ track.url, track.title, playlists[0].idmusic_playlist ]
                    }
                    mysql.query(`INSERT INTO track(url, title, idmusic_playlist) VALUES ?`, [Object.values(info)]);
                    return await message.channel.send(`Successfully update playlist **${playlistName}`);
                } else return await message.channel.send("Save failed. Please choose another name");

            });
        }

    },

    // handleMessage(message) {
    //     this.execute(message);
    // },
};
