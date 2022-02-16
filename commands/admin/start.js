const { SlashCommandBuilder } = require('@discordjs/builders');
const { Player } = require('discord-player');

const { checkAudioCommandPermission } = require('../../resource/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Autoplay music or radio!')
		.addStringOption(option => option
			.setName('playlist')
			.setDescription('Name of the playlist')
			.setRequired(false))
	,

	async execute(interaction) {

		if (!checkAudioCommandPermission(interaction))
			return await interaction.reply({ content: "You don't have permission to do this command!", ephemeral: true });

		const mysql = interaction.client.mysql;
		if (!mysql) return await interaction.reply({ content: "Can not get your data from database, I'm sorry", ephemeral: true });

		const player = interaction.client.player || (() => {
			let player = new Player(interaction.client, { filter: "audioonly" });
			player.on('trackStart', (queue, track) => {
				interaction.channel.send({ content: `🎶 | Now playing **${track.title}** !` })
			})
			interaction.client.player = player;
			return player;
		})();

		const queue = player.getQueue(interaction.guild) || player.createQueue(interaction.guild, {
			metadata: {
				channel: interaction.channel
			}
		});

		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			queue.destroy();
			return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
		}

		const userId = interaction.user.id + interaction.guildId;

		let playlist = {};
		if (!interaction.options.getString("playlist")) {
			const sql = `SELECT music_playlist.* FROM music_playlist WHERE iduser = "${userId}" 
						AND idmusic_playlist = (SELECT default_music_playlist FROM user WHERE iduser = "${userId}")`;
			const [playlists] = await mysql.query(sql);

			if (playlists.length == 0)
				return interaction.reply(`You don't have any playlist available to play, please save a playlist`);

			//Play this playlist
			const [tracks] = await mysql.query(`SELECT url FROM track WHERE idmusic_playlist = ${playlists[0].idmusic_playlist} ORDER BY idtrack`);
			playlist.name = playlists[0].name;
			playlist.urls = tracks.map(track => track.url);

		} else {
			playlist.name = interaction.options.getString("playlist");
			const [tracks] = await mysql.query(`SELECT url FROM track WHERE idmusic_playlist = (SELECT idmusic_playlist FROM music_playlist WHERE name = "${playlist.name}") ORDER BY idtrack`);

			if (tracks.length == 0) return interaction.reply(`No track name **${playlist.name}**`);
			playlist.urls = tracks.map(track => track.url);
		}

		if (queue.nowPlaying()) {
			interaction.reply(`❤ | Add playlist **${playlist.name}**`)
		} else interaction.reply(`❤ | Play playlist **${playlist.name}**`);

		playlist.urls.forEach(async (url, index) => {
			await player.search(url, {
				requestedBy: interaction.user
			}).then(x => (queue.addTrack(x.tracks[0])));
			if (index == 0) queue.play(undefined, { leaveOnEmptyCooldown: 5 * 60 * 1000 });
		});
		return;

	},

	// handleMessage(message) {
	// 	if (interaction.options.getSubcommand() === 'user') {
	// 		handleUser.handleMessage(message);
	// 	} else if (interaction.options.getSubcommand() === 'server') {
	// 		handleServer.handleMessage(message);
	// 	}
	// }
};

/**
 * Description: Autoplay music or radio
 * Command: music 
 * Choose a saved playlist to play
 * Nothing: autoplay current song
 * Command: radio
 * Number option: Number of song to play
 * No option: Query for latest release of default channels
 * Option playlist: A given playlists
 * Query for the latest release of my favorites radio channels
 */