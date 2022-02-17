const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server info!'),
    async execute(interaction) {
        const guild = await interaction.client.guilds.fetch(interaction.guildId);
        const owner = await guild.members.fetch(guild.ownerId);
        const channels = await guild.channels.fetch();
        // inside a command, event listener, etc.
        const serverEmbed = new MessageEmbed()
            .setColor('AQUA')
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: 'Owner', value: `@${owner.user.username}#${owner.user.discriminator}`},
                { name: 'Number of users', value: `${guild.memberCount}`, inline: true },
                { name: 'Number of channels', value: `${channels.size}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'From NeyNey with luv!' });
        return await interaction.reply({ embeds: [serverEmbed] });
    },

    async handleMessage(message) {
        this.execute(message);
    }
};