const { SlashCommandBuilder } = require('@discordjs/builders');

const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');
const { execute } = require('./play')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insert')
        .setDescription('Insert a song which will be played after current song!')
        .addStringOption( option => 
            option.setName('query')
                .setDescription('Link or search string')
                .setRequired(true) ),

    async execute(interaction) {
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "You have not joined a channel or I'm playing in another channel!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) {
            return await execute(interaction);
        }

        const query = interaction.options.getString('query');

        await interaction.deferReply();
        const queue = interaction.client.player.getQueue(interaction.guild);
        const track = await interaction.client.player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

        queue.insert(track);
        return await interaction.followUp(` 👌 | Next song: **${track.title}**! `);
    }
};