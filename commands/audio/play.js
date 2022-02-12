const { SlashCommandBuilder } = require('@discordjs/builders');
const { Player } = require('discord-player');

const { checkAudioCommandPermission } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song!')
        .addStringOption(option => 
            option.setName('query')
                    .setDescription('Play music from youtube, soundcloud, spotify')
                    .setRequired(true)
            ),
    aliases: ['p'],
            
    async execute(interaction) {
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "You have not joined a channel or I'm playing in another channel!", ephemeral: true });

        const query = interaction.options.getString('query');

        const player = interaction.client.player || ( () => {
            let player = new Player(interaction.client, { filter: "audioonly" });
            interaction.client.player = player;
            return player;
        } )();

        const queue = player.getQueue(interaction.guild) || 
            player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });

        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        await interaction.deferReply();
        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

        if (!track.playlist) {
            await interaction.followUp({ content: `👌 | Queue **${track.title}** !`, ephemeral: true });
            queue.play(track);
        } else {
            await interaction.followUp({ content: `👌 | Queue **${track.playlist.tracks.length} tracks** !`, ephemeral: true });
            queue.addTracks(track.playlist.tracks);
            queue.play();
        }
    },    
};