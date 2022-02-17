const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setdefault')
        .setDescription('Set a playlist as default playlist')
        .addStringOption(option =>
            option.setName("playlist")
                .setDescription("Playlist name")
                .setRequired(true)),
    async execute(interaction) {
        const playlistName = interaction.options.getString("playlist");

        const mysql = interaction.client.mysql;
        if (!mysql) return message.reply({ content: ` 💔 | Can not set yet`, ephemeral: true })

        const userId = interaction.user.id + interaction.guildId;

        const sql = `UPDATE user SET default_music_playlist = 
            (SELECT idmusic_playlist FROM music_playlist WHERE iduser = "${userId}" AND name = "${playlistName}" ) 
            WHERE iduser = "${userId}"`
        const [ result ] = await mysql.query(sql);
        if (result.affectedRows == 0) return interaction.reply("Playlist doesn't exist");

        return interaction.reply({ content: ` 🆗 | Successfully set **${playlistName}** as default playlist`, ephemeral: true });
    },

    async handleMessage(message) {
        const args = message.content.split(' ');
        args.shift();
        const playlistName = args.join(' ');  

        const mysql = message.client.mysql;
        if (!mysql) return message.reply({ content: ` 💔 | Can not delete yet`, ephemeral: true })

        const sql = `UPDATE user SET default_music_playlist = 
            (SELECT idmusic_playlist FROM music_playlist WHERE iduser = "${userId}" AND name = "${playlistName}" ) 
            WHERE iduser = "${userId}"`
        const [ result ] = await mysql.query(sql);
        if (result.affectedRows == 0) return message.reply("Playlist doesn't exist");

        return message.reply({ content: ` 🆗 | Successfully set **${playlistName}** as default playlist`, ephemeral: true });
    },
};