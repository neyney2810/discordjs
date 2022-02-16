const { SlashCommandBuilder } = require('@discordjs/builders');
const handleUser = require('./user');
const handleServer = require('./server')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get info about a user or a server!')
		.addSubcommand( subcommand => 
			subcommand.setName('user')
				.setDescription('Info about a user')
				.addUserOption(option => option.setName('target').setDescription('The user')))
		.addSubcommand( subcommand => 
			subcommand.setName('server')
				.setDescription('Info about the server')),
				
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			await handleUser.execute(interaction);
		} else if (interaction.options.getSubcommand() === 'server') {
			await handleServer.execute(interaction);
		}
	},

	handleMessage(message) {
		if (interaction.options.getSubcommand() === 'user') {
			handleUser.handleMessage(message);
		} else if (interaction.options.getSubcommand() === 'server') {
			handleServer.handleMessage(message);
		}
	}
};