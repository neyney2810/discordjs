const { prefix } = require('../public_config.json');

module.exports = {
        name: 'messageCreate',
        async handleEvent(message) {
                if (message.author.bot) return;

                const args = message.content.split(' ');
                const cmd = args.shift().toLowerCase();
                if (!cmd.startsWith(prefix)) return;
                try {
                        message.client.commands.get(cmd.substring(1,))?.handleMessage(message);

                } catch (error) {
                        console.log(error);
                }
        },
};