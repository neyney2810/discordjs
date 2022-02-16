const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const neyney = require('../../resource/neyney.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('neyney')
        .setDescription('Replies with NeyNey\'s info!'),
    async execute(interaction) {
        const clientEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('NeyNey')
            .setURL(neyney.landingPage.url)
            .setAuthor({ name: 'NeyNey\'s information', iconURL: neyney.landingPage.url, url: neyney.landingPage.url })
            .setDescription(neyney.description)
            .setThumbnail(neyney.avatarURL)
            .addFields(
                { name: "\u200B", value: "Connect me!"},
                { name: 'Github', value: neyney.github.url},
                { name: 'Discord', value: neyney.discord.tag },
                { name: 'Facebook', value: neyney.facebook.url },
                { name: 'Instagram', value: neyney.instagram.url },
                { name: 'Buy me a coffee', value: neyney.donate.url },
            )
            .setImage(neyney.avatarURL)
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: neyney.avatarURL});
        return interaction.reply({ embeds: [ clientEmbed ] });
    },

    handleMessage(message) {
        this.execute(message);
    }
};