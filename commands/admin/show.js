/**
 * Add new
 */

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show')
        .setDescription('Show the saved music playlists')
        .addStringOption(option =>
            option.setName("playlist")
                .setDescription("Playlist name")
        ),
    async execute(interaction) {
        const playlistName = interaction.options.getString("playlist");

        const mysql = interaction.client.mysql;
        const userId = interaction.user.id + interaction.guildId;

        if (!playlistName) {
            //Get all the playlist of this user
            const [ playlists ] = await mysql.query(`SELECT * FROM music_playlist WHERE iduser = ${userId}`);
            if (playlists.length == 0) return interaction.reply("You have no playlist saved");

            const list = playlists.map((playlist, index) => {
                return `${index+1}. ** ${playlist.name}** | saved At: ${new Date(playlist.createdAt).toLocaleString()} \n`;
            }).join('').slice(0, 1900) + '\n Please specify a playlist name to show the tracks';

            return interaction.reply({content: list, ephemeral: true});
        }

        const [ tracks ] = await mysql.query(`SELECT * FROM track WHERE idmusic_playlist = (SELECT idmusic_playlist FROM music_playlist WHERE name = "${playlistName}" LIMIT 1)`);
        if (tracks.length == 0) return interaction.reply("Playlist doesn't exist");

        const list = tracks.map((track, index) => {
            if (index < 15) return `${index+1}. ** ${track.title}**\n`;
            if (index == 15) return `And **${tracks.length - 15}** more...`;
        });

        return interaction.reply({content: list.join(''), ephemeral: true});
    },

    // handleMessage(message) {
    //     this.execute(message);
    // },
};