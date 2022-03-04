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

        const player = interaction.client.player || (() => {

            let player = new Player(interaction.client, { filter: "audioonly" });

            player.on('trackStart', (queue, track) => {
                interaction.channel.send({ content: `🎶 | Now playing **${track.title}** !` })
            })

            player.on('connectionError', (queue, error) => {
                queue.play(undefined, { leaveOnEmptyCooldown: 5 * 60 * 1000 });
            })

            player.on('error', (queue, error) => {
                queue.play(undefined, { leaveOnEmptyCooldown: 5 * 60 * 1000 });
            })

            interaction.client.player = player;
            return player;
        })();

        const queue = player.getQueue(interaction.guild) ||
            player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });

        // verify vc 
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }


        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.reply({ content: `❌ | Track **${query}** not found!` });

        if (!track.playlist) {
            await interaction.reply({ content: `👌 | Queue **${track.title}** !`, ephemeral: true });
            queue.addTrack(track);
        } else {
            await interaction.reply({ content: `👌 | Queue **${track.playlist.tracks.length} tracks** !`, ephemeral: true });
            queue.addTracks(track.playlist.tracks);
        }
        if (queue.nowPlaying().id == track.id) queue.play(undefined, { leaveOnEmptyCooldown: 5 * 60 * 1000 });
        return;
    },

    async handleMessage(message) {
        const args = message.content.split(' ');
        args.shift();
        const query = args.join(' ');

        const player = message.client.player || (() => {
            let player = new Player(interaction.client, { filter: "audioonly" });

            // player.on('trackStart', (queue, track) => {
            //     interaction.channel.send({ content: `🎶 | Now playing **${track.title}** !` })
            // })

            player.on('connectionError', (queue, error) => {
                queue.play(undefined, { leaveOnEmptyCooldown: 5 * 60 * 1000 });
            })

            player.on('error', (queue, error) => {
                queue.play(undefined, { leaveOnEmptyCooldown: 5 * 60 * 1000 });
            })

            interaction.client.player = player;
            return player;
        })();

        const queue = player.getQueue(message.guild) ||
            player.createQueue(message.guild, {
                metadata: {
                    channel: message.channel
                }
            });

        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.destroy();
            return message.channel.send({ content: "Could not join your voice channel!" });
        }

        const track = await player.search(query, {
            requestedBy: message.user
        }).then(x => x.tracks[0]);
        if (!track) return message.channel.send({ content: `❌ | Track **${query}** not found!` });

        if (!track.playlist) {
            await message.channel.send({ content: `👌 | Queue **${track.title}** !` });
            queue.addTrack(track);
        } else {
            await message.channel.send({ content: `👌 | Queue **${track.playlist.tracks.length} tracks** !` });
            queue.addTracks(track.playlist.tracks);
        }
        if (queue.nowPlaying().id == track.id) queue.play(undefined, { leaveOnEmptyCooldown: 5 * 60 * 1000 });
        return;
    },

    // handleMessage(message) {

    // },
};
