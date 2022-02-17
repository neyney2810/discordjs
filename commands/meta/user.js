const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user info!')
        .addUserOption( option => 
            option.setName('target')
                .setDescription("Return tag of the mentioned user, else your tag")),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const URL = user.avatarURL({ format: 'jpg', dynamic: 'true', size: 1024 });
        const embed = new MessageEmbed()
            .setImage(URL)
            .setURL(URL)
            .setTitle(`Download`);

        return await interaction.reply({ content: `${user.username}'s tag: @${user.username}#${user.discriminator}`, embeds: [embed]});
    },

    handleMessage(message) {
        const args = message.content.split(' ');
        args.shift();

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const URL = member.user.avatarURL({ format: 'jpg', dynamic: 'true', size: 1024 });
        const embed = new MessageEmbed()
            .setImage(URL)
            .setURL(URL)
            .setTitle(`Download`);
        return message.channel.send({ content: `${member.user.username}'s tag: @${member.user.username}#${member.user.discriminator}`, embeds: [embed]});
    }

};