//Spotify podcast: (show) e.g https://open.spotify.com/show/39GCuBVNprJymsZifdwmjg?si=2f378632d19e4900
//Youtube channel: e.g https://www.youtube.com/c/EngineeringwithUtsav

//If no list specified => default radio playlist

//If no default radio playlist => create a radio playlist and set it as default => name: ""

//If has default radio playlist => create new channel with default radio playlist

//If list name specified => find this list and add this channel

const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkAudioCommandPermission, checkValidChannel } = require('../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addchannel')
        .setDescription('Add a channel to a radio playlist')
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('URL of channel (Spotify or Youtube)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('playlist')
                .setDescription('Playlist name')
                .setRequired(false)),
    async execute(interaction) {

        if (!checkAudioCommandPermission(interaction))
            return await interaction.reply({ content: "Can not do this command!", ephemeral: true });

        const mysql = interaction.client.mysql;
        if (!mysql) return await interaction.reply({ content: "Can not create a playlist", ephemeral: true });

        const playlistName = interaction.options.getString("playlist");
        const url = interaction.options.getString("channel");
        const userId = interaction.user.id + interaction.guildId;

        //Check user => create a user
        await mysql.query(`INSERT IGNORE INTO user(iduser, idguild, iddiscord) VALUES ("${userId}", "${interaction.guildId}", "${interaction.user.id}" )`)
        
        let playlistID;
        if (!playlistName) {
            const [[default_radio_playlist]] = await mysql.query(`SELECT default_radio_playlist FROM user WHERE iduser = "${userId}"`);
            if (!default_radio_playlist) {
                [[{insertId : playlistID}]] = await mysql.query(`INSERT INTO radio_playlist(name, iduser) VALUES ("", "${userId}")`);
            } else playlistID = default_radio_playlist;
        } else [[{idradio_playlist : playlistID}]] = await mysql.query(`SELECT idradio_playlist FROM radio_playlist WHERE iduser = "${userId}" AND name = "${playlistName}"`);


        //Create Channel
        if (checkValidChannel(url)) {
            mysql.query(`INSERT INTO channel(url, idradio_playlist) VALUES ("${url}", "${playlistID}")`);
            return await interaction.reply(` ✅ | Add new channel to playlist **${playlistName || "default radio playlist"}**`);
        }
            return await interaction.reply(` Channel URL invalid `);

    },

    // handleMessage(message) {
    //     this.execute(message);
    // },
};
