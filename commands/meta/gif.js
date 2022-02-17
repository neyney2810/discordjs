const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { giphy_api_key } = require('../../config.json')
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('Send a random gif!')
        .addStringOption(option => 
                option.setName('category')
                    .setDescription('Gif category')
                    .setRequired(true)
                    ),
	async execute(interaction) {
        const category = interaction.options.getString('category');
        const { direct, short } = await fetchGifURL(category);

        const gifEmbed = new MessageEmbed()
            .setColor(0x000000)
            .setDescription(short)
            .setImage(direct);
		return await interaction.reply({ embeds: [gifEmbed] });
	},

    async handleMessage(message) {
        const args = message.content.split(' ');
        args.shift();
        const { direct, short } = await fetchGifURL(args.join(' '));
        const gifEmbed = new MessageEmbed()
            .setColor(0x000000)
            .setDescription(short)
            .setImage(direct);

		return await message.channel.send({ embeds: [gifEmbed] });
    }
};

const fetchGifURL = async (keyword) => {
    const res = await axios.get(`https://api.giphy.com/v1/gifs/search?`+
        `q=${keyword.replaceAll(" ","+")}`+
        '&limit=1'+
        '&offset=0'+
        `&api_key=${giphy_api_key}`);
    return { direct: res.data.data[0].images.original.url, short: res.data.data[0].bitly_url};
}
