const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar URL of the selected user, or your own avatar.')
        .addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const URL = user.avatarURL({ format: 'jpg', dynamic: 'true', size: 1024 });
        const embed = new MessageEmbed()
            .setImage(URL)
            .setURL(URL)
            .setTitle(`Download`);

        return interaction.reply({ content: `${user.username} 's avatar: `, embeds: [embed]});
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
        message.channel.send({ content: `${member.user.username} 's avatar: `, embeds: [embed]});
    }
    
}