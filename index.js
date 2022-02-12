const { readdirSync } = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

//Command files
client.commands = new Collection();
readdirSync('./commands/').filter(file => !file.includes('.')).forEach(dir => {
  const commandFiles = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`);
    client.commands.set(command.data.name, command);
  }
});

//Event files
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.handleEvent(...args));
  } else {
    client.on(event.name, (...args) => event.handleEvent(...args));
  }
}

client.login(token);