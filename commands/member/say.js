const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Repeat user message!')
        .addStringOption(option => 
            option.setName('message')
                    .setDescription('The message to echo back')
                    .setRequired(true)),
    async execute(interaction) {
        await interaction.reply(interaction.options.getString('message'));
    },

    handleMessage(message) {
        console.log(message.client);
        const args = message.content.split(' ');
        args.shift();
        message.channel.send(args.join(' '));          
    }
};