const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription('Buy me a coffee'),

    aliases: ['dnt'],

    async execute(interaction) {
        const donateEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Donate for NeyNey')
            .setURL(neyney.landingPage.url)
            .setAuthor(
                { name: 'NeyNey\'s information', iconURL: neyney.landingPage.url, url: neyney.landingPage.url }
            )
            .setDescription(neyney.description)
            .setThumbnail(neyney.avatarURL)
            .addField(
                { name: 'Buy me a coffee', value: neyney.donate.url },
            )
            .setImage(neyney.avatarURL)
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: neyney.avatarURL});
        return interaction.reply({ embeds: [ donateEmbed] });
    },

    handleMessage(message) {
        this.execute(message);
    }
};