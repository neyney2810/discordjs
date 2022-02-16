const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),
    async execute(interaction) {
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "Can not do this command!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) 
            return await interaction.reply({ content: "Can not loop as no player is active!", ephemeral: true });

        const queue = interaction.client.player.getQueue(interaction.guild);
        queue.shuffle();

        return await interaction.reply(getQueueEmbed(queue));
    },

    handleMessage(message) {
        this.execute(message);
    },
};

function getQueueEmbed(queue) {
    
    const list = queue.tracks.map((track, index) => {
        if (index < 15) return `${index+1}. ** ${track.title}**\n`;
        if (index == 15) return `And **${queue.tracks.length - 15}** more...`;
    });

    return list.join('');

}