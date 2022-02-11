const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('Send a random gif!')
        .addStringOption(option => 
                option.setName('category')
                    .setDescription('Gif category')
                    .setRequired(true)
                    .addChoices([['Funny', 'gif_funny'], ['Meme', 'gif_meme'], ['Movie', 'gif_movie']])
                    ),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};