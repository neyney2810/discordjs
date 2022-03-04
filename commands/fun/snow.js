const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snow')
        .setDescription('Send something from Hung to Snow'),
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setImage("https://i.ibb.co/svhPJH4/unknown.png")
            .setURL("https://i.ibb.co/svhPJH4/unknown.png")
            .setTitle(`Download`);

        return interaction.reply({ content: `Tin nhan duoc gui tu Hung toi Snow :< : \n Credit: Tus`, embeds: [embed]});
    },

    handleMessage(message) {
        const args = message.content.split(' ');
        args.shift();

        const embed = new MessageEmbed()
            .setImage("https://i.ibb.co/svhPJH4/unknown.png")
            .setURL("https://i.ibb.co/svhPJH4/unknown.png")
            .setTitle(`Download`);
        message.channel.send({ content: `Tin nhan duoc gui tu Hung toi Snow :< : \n Credit: Tus`, embeds: [embed]});
    }
    
}