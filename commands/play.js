const { SlashCommandBuilder } = require('@discordjs/builders');

const { GUILD_ID } = require('../config.json');
const AudioPlayer = require('../resource/audioplayer');
const Playlist = require('../resource/playlist');

const ytSearch = require('yt-search');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Repeat user message!')
        .addStringOption(option => 
            option.setName('url')
                    .setDescription('Youtube URL')
            )
        .addStringOption(option => 
            option.setName('keyword')
                .setDescription('search in youtube')
            ),
    async execute(interaction) {

        const guild = await interaction.client.guilds.fetch(GUILD_ID);
        const guildMember = await guild.members.fetch(interaction.user.id.toString());
        const channelId = guildMember.voice.channelId;

        if (!channelId){
            await interaction.reply("You have not joined in a voice channel");
            return;
        }

        let url = interaction.options.getString('url');

        if (!url) {
            const searchString = interaction.options.getString('keyword');
            if (searchString) {
                let results = await ytSearch(searchString);
                if (!results?.all?.length) {
                    return await interaction.reply(`No results found for your search string. Please try a different one.`);
                }
                url = results.all[0].url;
            }            
        }

        if (!url) return;
        
        try {
            const player = new AudioPlayer(channelId, interaction.guild);

            const playlist = new Playlist();
            playlist.addURL(url);

            await player.play(playlist.getNextResource());
            return await interaction.reply("Play");
        } catch (error) {
            return await interaction.reply(`Error: ${error.message}`)
        }

    },    
};