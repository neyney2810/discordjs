const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueueRepeatMode } = require('discord-player');

const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Repeat current song or playlist')
        .addSubcommand( subcommand => 
			subcommand.setName('off')
				.setDescription('Turn off loop mode'))
		.addSubcommand( subcommand => 
			subcommand.setName('current')
				.setDescription('Repeat current track'))
        .addSubcommand( subcommand => 
            subcommand.setName('all')
                .setDescription('Repeat current playlist'))
        .addSubcommand( subcommand => 
            subcommand.setName('autoplay')
                .setDescription('Autoplay')),

    async execute(interaction) {
        if (!checkAudioCommandPermission(interaction)) 
            return await interaction.reply({ content: "You have not joined a channel or I'm playing in another channel!", ephemeral: true });

        if (!checkPlayerRunning(interaction)) 
            return await interaction.reply({ content: "Can not loop as no player is running!", ephemeral: true });

        const queue = interaction.client.player.getQueue(interaction.guild);
        
        //LOOP
        const subcommands = {
            off: QueueRepeatMode.OFF,
            current: QueueRepeatMode.TRACK,
            all: QueueRepeatMode.QUEUE,
            autoplay: QueueRepeatMode.AUTOPLAY
        }
        const subcommand = interaction.options.getSubcommand();
        console.log(subcommand);
        const repeatMode = subcommand ? subcommands[subcommand] : QueueRepeatMode.QUEUE;
        queue.setRepeatMode(repeatMode);
        return await interaction.reply(`💗 | Repeat mode: ${subcommand}`);
    },

    
    // handleMessage(message) {

    // },
};