const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete the saved playlist')
        .addStringOption(option =>
            option.setName("playlist")
                .setDescription("Playlist name")
                .setRequired(true)),
    async execute(interaction) {
        const playlistName = interaction.options.getString("playlist");

        const mysql = interaction.client.mysql;
        const userId = interaction.user.id + interaction.guildId;

        const [ result ] = await mysql.query(`DELETE FROM music_playlist WHERE iduser = "${userId}" AND name = "${playlistName}"`);
        if (result.affectedRows == 0) return interaction.reply("Playlist doesn't exist");

        return interaction.reply({ content: ` 🆗 | Successfully deleted **${playlistName}** `, ephemeral: true });
    },

    async handleMessage(message) {
        const args = message.content.split(' ');
        args.shift();
        const playlistName = args.join(' ');  

        const mysql = message.client.mysql;
        if (!mysql) return message.reply({ content: ` 💔 | Can not delete yet`, ephemeral: true })

        const userId = message.author.id + message.guildId;

        const [ result ] = await mysql.query(`DELETE FROM music_playlist WHERE iduser = "${userId}" AND name = "${playlistName}"`);
        if (result.affectedRows == 0) return message.reply("Playlist doesn't exist");

        return message.reply({ content: ` 🆗 | Successfully deleted **${playlistName}** `, ephemeral: true });
    },
};